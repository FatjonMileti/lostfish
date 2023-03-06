import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
const router: Router = Router();
import * as joi from 'joi';
import validator from '../middleware/validator';
import createError from 'http-errors';
import User, { IUser } from '../data/user';
import { LoginLog, LoginLogAction } from '../data/logs';
import { loginLimiter } from '../middleware/rateLimiter';
import authorize from '../middleware/authorize';
import RevokedToken from '../data/revokedToken';
import UsedRefreshToken from '../data/usedRefreshToken';

const generateTokens = (user: IUser): { token: string; refresh: string } => {
    const token = jwt.sign(
        {
            iss: 'backend.name',
            aud: 'backend.name:api',
            sub: user._id.toString(),
            fname: user.firstName,
            username: user.username,
            role: user.role
        },
        <jwt.Secret>process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE_SECONDS + 's',
            algorithm: 'HS256'
        }
    );
    const refresh = jwt.sign(
        {
            iss: 'backend.name',
            aud: `backend.name:token`,
            sub: user._id.toString()
        },
        <jwt.Secret>process.env.REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_EXPIRE_SECONDS + 's',
            algorithm: 'HS256'
        }
    );

    return { token, refresh };
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
 */
router.post(
    '/login',
    loginLimiter,
    validator(
        joi.object({
            username: joi.string().required(),
            password: joi.string().required()
        })
    ),
    async (req: Request, res: Response) => {
        const model = res.locals.model! as { username: string; password: string };

        const loginError = () => createError(400, 'Bad username or password');

        const user: IUser | null = await User.findOne({ username: model.username, isDisabled: false });
        if (!user) throw loginError();

        const passCheck: boolean = await new Promise((resolve) => {
            bcrypt.compare(req.body.password, user!.hash, (err: Error | undefined, same: boolean) => {
                if (same) return resolve(true);

                return resolve(false);
            });
        });
        if (!passCheck) throw loginError();

        user.lastLogin = new Date();
        await user.save();

        const { token, refresh } = generateTokens(user);
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
    }
);

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
router.post(
    '/refresh',
    validator(
        joi.object({
            refresh_token: joi.string().required()
        })
    ),
  async (req: Request, res: Response) => {
      const { refresh_token } = res.locals.model as { refresh_token: string };
      const payload: jwt.JwtPayload | false = await new Promise((resolve) => {
          jwt.verify(
            refresh_token!,
            <jwt.Secret>process.env.REFRESH_SECRET,
            {
                issuer: 'digital.advertising',
                audience: 'digital.advertising:token',
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

        const user = await User.findOne({ _id: payload.sub!, isDisabled: false });
        if (!user) throw createError(401, 'unauthorized');

        await new UsedRefreshToken({
            token: refresh_token,
            expiresAt: new Date(payload.exp! * 1000)
        }).save();

        const { token, refresh } = generateTokens(user);
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
    }
);

/**
 * @api {post} /api/account/logout Logout
 * @apiDescription Logout user and revoke access_token
 * @apiGroup Account
 * @apiSampleRequest /api/account/logout
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.post('/logout', authorize(), async (req: Request, res: Response) => {
    await new RevokedToken({
        token: res.locals.token,
        expiresAt: new Date(res.locals.claims!.exp! * 1000)
    }).save();

    await new LoginLog({
        user: res.locals.userId,
        info: res.locals.username,
        action: LoginLogAction.Logout
    }).save();
    return res.json({ success: true });
});

//TODO: forgot password
//TODO: /hash/change password

module.exports = router;
