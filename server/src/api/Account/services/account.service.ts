import { UserDocument } from '../../User/user.interface';
import jwt from 'jsonwebtoken';
import express from 'express';
import userService from '../../User/user.service';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { LoginLog, LoginLogAction } from '../../../data/logs';
import UserModel from '../../User/user.schema';
import bcrypt from 'bcrypt';
import UsedRefreshToken from '../../../data/usedRefreshToken';
import RevokedToken from '../../../data/revokedToken';
import { packRules } from '@casl/ability/extra';
import defineAbilitiesFor from '../../../casl/casl';

const login = async (req: express.Request, res: express.Response) => {
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

  // tslint:disable-next-line:no-shadowed-variable
  const { token, refresh } = generateTokens(user);

  await new LoginLog({
    user: user._id,
    info: user.first_name,
    action: LoginLogAction.Login
  }).save();

  const rules = packRules(defineAbilitiesFor(user.role, user._id.toString()).rules);

  return res.json({
    token_type: 'bearer',
    access_token: token,
    expires_in: process.env.JWT_EXPIRE_SECONDS,
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
    rules
  });
};

const refreshToken = async (req: express.Request, res: express.Response) => {
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

  console.log('payload: ', payload);

  const used = await UsedRefreshToken.findOne({ token: refresh_token });
  if (used) throw createError(401, 'refresh_token is already used');

  const user = await UserModel.findOne({
    _id: payload.sub!,
    is_disabled: false
  });

  if (!user) throw createError(401, 'unauthorized');

  await new UsedRefreshToken({
    token: refresh_token,
    expiresAt: new Date(payload.exp! * 1000)
  }).save();

  const { token, refresh } = generateTokens(user);

  await new LoginLog({
    user: user._id,
    info: user.first_name,
    action: LoginLogAction.Refresh
  }).save();

  const rules = packRules(defineAbilitiesFor(user.role).rules);

  return res.json({
    token_type: 'bearer',
    access_token: token,
    expires_in: process.env.JWT_EXPIRE_SECONDS,
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
    rules
  });
};

const getMyProfile = async (req: express.Request, res: express.Response) => {
  const user = await userService.findOne({ _id: res.locals.user_id });
  if (!user) {
    throw createError(404, { message: 'not_found' });
  }
  const rules = packRules(defineAbilitiesFor(user.role, user._id.toString()).rules);
  const data: any = { ...user.toObject(), rules };

  res.status(httpStatus.OK).json(data);
};

const getAccessToken = async (req: express.Request, res: express.Response) => {
  const user = await userService.findOne({ _id: res.locals.user_id });
  if (!user) {
    return res.status(400).send({ message: 'user_not_found' });
  }
  const { token, refresh } = generateTokens(user);

  await new LoginLog({
    user: user._id,
    info: user.first_name,
    action: LoginLogAction.Login
  }).save();

  const rules = packRules(defineAbilitiesFor(user.role).rules);

  return res.json({
    token_type: 'bearer',
    access_token: token,
    expires_in: process.env.JWT_EXPIRE_SECONDS,
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
    rules
  });
};

const generateTokens = (user: UserDocument): { token: string; refresh: string } => {
  const token = jwt.sign(
    {
      iss: 'lost.fish',
      aud: 'lost.fish:api',
      sub: user._id.toString(),
      fname: user.first_name,
      user_id: user._id.toString(),
      username: user.first_name,
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
      iss: 'lost.fish',
      aud: 'lost.fish:token',
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

const getAccountInvitation = async (req: express.Request, res: express.Response) => {
  // tslint:disable-next-line:variable-name
  const confirmation_token = req.params.token;
  const user: any = await userService.findOne({ confirmation_token });

  if (!user) {
    return res.status(404).json({ message: 'user_not_found' });
  }

  user.is_disabled = false;
  await user.save();

  const rules = packRules(defineAbilitiesFor(user.role).rules);

  const { token, refresh } = generateTokens(user);
  return res.json({
    token_type: 'bearer',
    access_token: token,
    expires_in: process.env.JWT_EXPIRE_SECONDS,
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
    rules
  });
};

const logout = async (req: express.Request, res: express.Response) => {
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

export default {
  login,
  logout,
  refreshToken,
  getMyProfile,
  getAccessToken,
  generateTokens,
  getAccountInvitation
};
