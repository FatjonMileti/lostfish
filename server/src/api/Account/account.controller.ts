import express, { Application, Request, Response, Router } from 'express';
const router: Router = Router();
import { Role, UserDocument } from '../User/user.interface';
import UserModel from '../User/user.schema';
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
import userService from '../User/user.service';
import axios from 'axios';
import { Client, auth } from 'twitter-api-sdk';
const { OAuth2Client } = require('google-auth-library');

// Google
const clientId = `${process.env.GOOGLE_CLIENT_ID}`;
const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`;
const redirectUri = `${process.env.GOOGLE_CLIENT_REDIRECT_URI}`;
const client = new OAuth2Client(clientId, clientSecret, redirectUri);

//Twitter
const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_AUTH_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_AUTH_SECRET as string,
  callback: process.env.TWITTER_REDIRECT_URL as string,
  scopes: ['tweet.read', 'users.read']
});

const STATE = 'my-state';
const clientTwitter = new Client(authClient);

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
          email: joi.string().required(),
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
    this.router.post('/login-google', this.loginGoogle);
    this.router.post('/login-facebook', this.loginFacebook);
    this.router.get('/create-twitter-url', this.generateTwitterUrl);
    this.router.get('/login-twitter-callback', this.loginWithTwitter);
    this.router.get('/get-access-tokens', authorize(), this.getAccessToken);
  }

  /**
   * @api {get} /api/account/get-access-tokens Get Tokens
   * @apiDescription Get tokens
   * @apiGroup Account
   * @apiSampleRequest /api/account/get-access-tokens
   *
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private getAccessToken = async (req: express.Request, res: express.Response) => {
    const user = await userService.findOne({ _id: res.locals.user_id });
    if (!user) {
      return res.status(400).send({ message: 'user_not_found' });
    }
    const { token, refresh } = this.accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.first_name,
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
   * @api {post} /api/account/login Login
   * @apiDescription Login user
   * @apiGroup Account
   * @apiSampleRequest /api/account/login
   *
   * @apiBody {string} username
   * @apiBody {string} password
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private login = async (req: express.Request, res: express.Response) => {
    const model = res.locals.model! as { email: string; password: string };

    const loginError = (message: string, code: string) => createError(400, { message, code });
    const user: UserDocument | null = await UserModel.findOne({
      email: model.email,
      is_disabled: false
    });
    if (!user) throw loginError('user_not_found', 'User not found');

    const passCheck: boolean = await new Promise((resolve) => {
      bcrypt.compare(req.body.password, user!.hash, (err: Error | undefined, same: boolean) => {
        if (same) return resolve(true);

        return resolve(false);
      });
    });
    if (!passCheck) throw loginError('incorrect_password', 'Bad password');

    user.last_login = new Date();
    await user.save();

    const { token, refresh } = this.accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.first_name,
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
   * @api {post} /api/account/login-google Login Google
   * @apiDescription Login user with google
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-google
   *
   * @apiBody {string} code
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginGoogle = async (req: Request, res: Response) => {
    const { code } = req.body;
    try {
      const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;

      // Verify and decode the ID token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return res.status(404).send({ message: 'user_not_found' });
      }

      let user = await userService.findOne({
        email: payload.email,
        'google.is_google_verified': true,
        is_disabled: false
      });

      if (!user) {
        user = await new UserModel({
          email: payload.email,
          first_name: payload.given_name,
          last_name: payload.family_name,
          google: {
            is_google_verified: true,
            google_user_id: payload?.id || '',
            username: payload?.username || ''
          },
          is_disabled: false,
          hash: null,
          role: Role.User
        }).save();

        if (!user) {
          return res.status(400).send({ message: 'user_can_not_created' });
        }
      }

      const { token, refresh } = this.accountService.generateTokens(user);

      await new LoginLog({
        user: user._id,
        info: user.first_name,
        action: LoginLogAction.Login
      }).save();

      return res.json({
        token_type: 'bearer',
        access_token: token,
        expires_in: process.env.JWT_EXPIRE_SECONDS,
        refresh_token: refresh,
        refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
      });
    } catch (error: any) {
      return res.send({ message: 'failed_login_with_google', error });
    }
  };

  /**
   * @api {post} /api/account/login-google Login Facebook
   * @apiDescription Login user with facebook
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-facebook
   *
   * @apiBody {string} token
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginFacebook = async (req: Request, res: Response) => {
    const fbToken = req.body.token;

    const url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${fbToken}`;

    try {
      const response = await axios.get(url);
      const userDetails: any = response.data;

      let user = await userService.findOne({
        email: userDetails.email,
        'facebook.is_facebook_verified': true,
        is_disabled: false
      });

      if (!user) {
        const name = userDetails.name.split(' ');
        user = await new UserModel({
          email: userDetails.email,
          first_name: name[0],
          last_name: name[1],
          facebook: {
            username: userDetails?.username || '',
            is_facebook_verified: true,
            facebook_user_id: userDetails.id
          },
          is_disabled: false,
          hash: null,
          role: Role.User
        }).save();

        if (!user) {
          return res.status(400).send({ message: 'user_can_not_created' });
        }
      }

      const { token, refresh } = this.accountService.generateTokens(user);

      await new LoginLog({
        user: user._id,
        info: user.first_name,
        action: LoginLogAction.Login
      }).save();

      return res.json({
        token_type: 'bearer',
        access_token: token,
        expires_in: process.env.JWT_EXPIRE_SECONDS,
        refresh_token: refresh,
        refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
      });
    } catch (error: any) {
      res.status(400).send({ message: 'failed_to_fetch_user', error });
    }
  };

  /**
   * @api {post} /api/account/login-twitter-callback Login Twitter callback
   * @apiDescription Login user with twitter callback
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-twitter-callback
   *
   * @apiQuery {string} code
   * @apiQuery {string} state
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginWithTwitter = async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      if (state !== STATE) return res.status(400).send({ message: 'State isnt matching' });
      const response = await authClient.requestAccessToken(code as string);

      // @ts-ignore
      const { data } = await clientTwitter.users.findMyUser();
      if (!data) {
        return res.status(400).send({ message: 'cant find_user' });
      }
      let user = await userService.findOne({
        'twitter.username': data.username,
        'twitter.twitter_user_id': data.id,
        is_disabled: false
      });

      if (!user) {
        const name = data.name.split(' ');
        user = await new UserModel({
          first_name: name[0],
          last_name: name[1],
          twitter: {
            username: data?.username || '',
            is_twitter_verified: true,
            twitter_user_id: data.id
          },
          is_disabled: false,
          hash: null,
          role: Role.User
        }).save();

        if (!user) {
          return res.status(400).send({ message: 'user_can_not_created' });
        }
      }
      const { token, refresh } = this.accountService.generateTokens(user);

      await new LoginLog({
        user: user._id,
        info: user.first_name,
        action: LoginLogAction.Login
      }).save();

      // return res.json({
      //   token_type: 'bearer',
      //   access_token: token,
      //   expires_in: process.env.JWT_EXPIRE_SECONDS,
      //   refresh_token: refresh,
      //   refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
      // });
      res.redirect('http://localhost:4000/login?validated=true&access_token=' + token);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

  /**
   * @api {get} /api/account/create-twitter-url Login Twitter generate url
   * @apiDescription Login user with twitter
   * @apiGroup Account
   * @apiSampleRequest /api/account/create-twitter-url
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private generateTwitterUrl = async (req: Request, res: Response) => {
    try {
      const authUrl = authClient.generateAuthURL({
        state: STATE,
        code_challenge: 'challenge',
        code_challenge_method: 'plain'
      });

      return res.send({ authUrl });
    } catch (error: any) {
      res.status(400).send({ message: 'url_not_generated' });
    }
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
      info: user.first_name,
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
