import { AppSubjects, CASLAction } from '../casl/casl.interface';
import { NextFunction, Request, Response } from 'express';
import defineAbilitiesFor, { IUserAbilityData } from '../casl/casl';
import httpStatus from 'http-status';
import UserSchema from '../api/User/user.schema';
import createError from 'http-errors';

const abilityMiddleware = (action: CASLAction, subject: AppSubjects) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, user_id } = res.locals;

    if (!role || !user_id) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'unauthorized' });
    }

    const user: IUserAbilityData = {
      _id: res.locals.user_id as string,
      role: res.locals.role as string
    };

    const ability = defineAbilitiesFor(user);

    if (!ability.can(action, subject)) {
      return res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
    }

    req.ability = ability;

    next();
  };
};

export const checkUpdateUserPermission = async (req: Request, res: Response, next: NextFunction) => {
  const loggedUser = await UserSchema.findById(res.locals.user_id);
  if (!loggedUser) {
    throw createError(httpStatus.UNAUTHORIZED, { message: 'Unauthorized' });
  }

  const ability = defineAbilitiesFor(loggedUser);

  if (!ability.can(CASLAction.Update, 'User', req.params.id)) {
    throw createError(httpStatus.FORBIDDEN, {
      message: `Unauthorized: You dont have permission to ${req.method} this user`
    });
  }

  next();
};

const canApproveDocument = (action: CASLAction, subject: AppSubjects) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, user_id } = res.locals;

    if (!role || !user_id) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'unauthorized' });
    }

    const user: IUserAbilityData = {
      _id: res.locals.user_id as string,
      role: res.locals.role as string
    };

    const ability = defineAbilitiesFor(user);

    if (!ability.can(action, subject, 'approved')) {
      return res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
    }

    next();
  };
};

export default abilityMiddleware;
