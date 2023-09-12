import { NextFunction, Request, Response } from 'express';
import config from '../config/index';
import httpStatus from 'http-status';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token;
    if (!token || !config.lostfishApiToken) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }

    if (token.toString() !== config.lostfishApiToken.toString()) {
      return res.status(httpStatus.UNAUTHORIZED).send('Token is not valid');
    }

    next();
  };
};
