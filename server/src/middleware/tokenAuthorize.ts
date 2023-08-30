import { NextFunction, Request, Response } from 'express';
import config from '../config/index';
import httpStatus from 'http-status';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token;
    if (!token || !config.lostfish_api_token) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }

    if (token.toString() !== config.lostfish_api_token.toString()) {
      return res.status(httpStatus.UNAUTHORIZED).send('Token is not valid');
    }

    next();
  };
};
