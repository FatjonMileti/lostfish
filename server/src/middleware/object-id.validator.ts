import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
export default (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id))
    throw createError(400, { message: 'invalid_id' });
  next();
};
