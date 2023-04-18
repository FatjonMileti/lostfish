import { Request, Response, NextFunction } from 'express';
import { Role } from '../enums';
import createError, { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';
import RevokedToken, { IRevokedToken } from '../data/revokedToken';

export const verifyToken = async (token: string): Promise<jwt.JwtPayload | false> => {
  return await new Promise((resolve) => {
    jwt.verify(
      token!,
      <jwt.Secret>process.env.JWT_SECRET,
      {
        issuer: 'lost.fish',
        audience: 'lost.fish:api',
        algorithms: ['HS256']
      },
      (err, decoded) => {
        if (err) return resolve(false);

        // @ts-ignore
        return resolve(decoded!);
      }
    );
  });
};

export default (roles?: Role[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    let token: string | undefined = req.headers.authorization;
    if (!token || !token.startsWith('Bearer '))
      throw createError(401, 'authorization bearer header is required');

    token = token.slice(7, token.length);

    const payload: jwt.JwtPayload | false = verifyToken(token);

    if (!payload) throw createError(401, 'invalid token');

    const revoked = await RevokedToken.findOne({ token });
    if (revoked) throw createError(401, 'token was revoked');

    if (roles && roles.length > 0 && roles.indexOf(<Role>payload.role) === -1) {
      throw createError(401, 'not allowed');
    }

    res.locals.token = token;
    res.locals.claims = payload;
    res.locals.user_id = res.locals.claims.sub;
    res.locals.username = payload.username;
    res.locals.role = <Role>payload.role;
    return next();
  };
};
