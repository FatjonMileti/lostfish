import { AppSubjects, CASLAction } from '../casl/casl.interface';
import { NextFunction, Request, Response } from 'express';
import defineAbilitiesFor from '../casl/casl';
import httpStatus from 'http-status';

const abilityMiddleware = (action: CASLAction, subject: AppSubjects) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, user_id } = res.locals;

    if (!role) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'unauthorized' });
    }

    const ability = defineAbilitiesFor(role);

    if (!ability.can(action, subject)) {
      return res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
    }

    next();
  };
};

export const checkUpdateUserPermission = (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.user_id ?? '';
  const userToUpdate = req.params.id as string;

  if (userId?.toString() !== userToUpdate.toString()) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ error: 'Unauthorized: You dont have permission to update users.' });
  }

  next();
};

export default abilityMiddleware;
