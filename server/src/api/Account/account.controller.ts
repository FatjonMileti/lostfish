import express, { Router } from 'express';

const router: Router = Router();

import { UserDocument } from '../User/user.interface';
import UserModel from '../../data/user';
import { LoginLog, LoginLogAction } from '../../data/logs';
import authorize from '../../middleware/authorize';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { loginLimiter } from '../../middleware/rateLimiter';
import validator from '../../middleware/validator';
import * as joi from 'joi';

import jwt from 'jsonwebtoken';
import UsedRefreshToken from '../../data/usedRefreshToken';
import RevokedToken from '../../data/revokedToken';
import accountService from './account.service';

export class AccountController {
  public router = router;
  private accountService = accountService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      loginLimiter,
      validator(
        joi.object({
          username: joi.string().required(),
          password: joi.string().required()
        })
      ),
      this.login
    );
    this.router.post(
      '/refresh',
      validator(
        joi.object({
          refresh_token: joi.string().required()
        })
      ),
      this.refresh
    );
    this.router.post('/logout', authorize(), this.logout);
  }


  /**
   * @api {post} /api/account/login Login
   * @apiDescription Login user
   * @apiGroup Account
   * @apiSampleRequest /api/account/login
   *
   * @apiBody {string} username
   * @apiBody {string} password
   *
   * @apiPermission anonymous
   */
  private login = async (req: express.Request, res: express.Response) => {
    const model = res.locals.model! as { username: string; password: string };
    const loginError = () => createError(400, 'Bad username or password');
    const user: UserDocument | null = await UserModel.findOne({
      username: model.username,
      is_disabled: false
    });
    if (!user) throw loginError();

    const passCheck: boolean = await new Promise((resolve) => {
      bcrypt.compare(
        req.body.password,
        user!.hash,
        (err: Error | undefined, same: boolean) => {
          if (same) return resolve(true);

          return resolve(false);
        }
      );
    });
    if (!passCheck) throw loginError();

    user.last_login = new Date();
    await user.save();

    const { token, refresh } = this.accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.username,
      action: LoginLogAction.Login
    }).save();

    return res.json({
      token_type: 'bearer',
      access_token: token,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
    });
  };


  /**
   * @api {post} /api/account/refresh Refresh
   * @apiDescription Refresh access_token
   * @apiGroup Account
   * @apiSampleRequest /api/account/refresh
   *
   * @apiBody {string} refresh_token
   *
   * @apiPermission anonymous
   */
  private refresh = async (req: express.Request, res: express.Response) => {
    const { refresh_token } = res.locals.model as { refresh_token: string };
    const payload: jwt.JwtPayload | false = await new Promise((resolve) => {
      jwt.verify(
        refresh_token!,
        <jwt.Secret>process.env.REFRESH_SECRET,
        {
          issuer: 'lost.fish',
          audience: 'lost.fish:token',
          algorithms: ['HS256']
        },
        (err, decoded) => {
          if (err) return resolve(false);

          // @ts-ignore
          return resolve(decoded!);
        }
      );
    });

    if (!payload) throw createError(401, 'invalid token');

    const used = await UsedRefreshToken.findOne({ token: refresh_token });
    if (used) throw createError(401, 'refresh_token is already used');

    const user = await UserModel.findOne({
      _id: payload.sub!,
      isDisabled: false
    });

    if (!user) throw createError(401, 'unauthorized');

    await new UsedRefreshToken({
      token: refresh_token,
      expiresAt: new Date(payload.exp! * 1000)
    }).save();

    const { token, refresh } = this.accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.username,
      action: LoginLogAction.Refresh
    }).save();

    return res.json({
      token_type: 'bearer',
      access_token: token,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
    });
  };

  /**
   * @api {post} /api/account/logout Logout
   * @apiDescription Logout user and revoke access_token
   * @apiGroup Account
   * @apiSampleRequest /api/account/logout
   *
   * @apiPermission authorize
   * @apiUse bearer
   */
  private logout = async (req: express.Request, res: express.Response) => {
    await new RevokedToken({
      token: res.locals.token,
      expiresAt: new Date(res.locals.claims!.exp! * 1000)
    }).save();

    await new LoginLog({
      user: res.locals.user_id,
      info: res.locals.username,
      action: LoginLogAction.Logout
    }).save();
    return res.json({ success: true });
  };
}
