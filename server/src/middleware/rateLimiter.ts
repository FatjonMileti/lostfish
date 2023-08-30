import { RateLimiterMongo, IRateLimiterMongoOptions, IRateLimiterRes } from 'rate-limiter-flexible';
import { connection } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import config from '../config/index';

//1000 req/hour/IP
const general: RateLimiterMongo = new RateLimiterMongo(<IRateLimiterMongoOptions>{
  storeClient: connection,
  keyPrefix: 'ratelimit.general',
  points: config.rateLimiter, // Number of points
  duration: 60 * 60, // Per second(s)
  blockDuration: 60 * 60
});
export const generalLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await general.consume(req.ip, 1);
    return next();
  } catch (err) {
    res.set('Retry-After', Math.round((<IRateLimiterRes>err).msBeforeNext! / 1000).toString() || '1');
    return next(createError(429, 'Too Many Requests'));
  }
};

//10 req/5 min/IP
const login: RateLimiterMongo = new RateLimiterMongo(<IRateLimiterMongoOptions>{
  storeClient: connection,
  keyPrefix: 'ratelimit.login',
  points: 10, // Number of points
  duration: 60 * 5, // Per second(s)
  blockDuration: 60 * 5
});

export const loginLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login.consume(req.ip, 1);
    return next();
  } catch (err) {
    res.set('Retry-After', Math.round((<IRateLimiterRes>err).msBeforeNext! / 1000).toString() || '1');
    return next(createError(429, 'Too Many Requests'));
  }
};
