import { CASLAction, AppSubjects } from '../casl/casl.interface';
import { Request, Response, NextFunction } from 'express';
import defineAbilitiesFor from '../casl/casl';
import httpStatus from 'http-status';

const abilityMiddleware = (action: CASLAction, subject: AppSubjects) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, user_id } = res.locals;

    if (!role) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'unauthorized' });
    }

    const ability = defineAbilitiesFor(role, user_id);
    if (!ability.can(action, subject)) {
      return res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
    }

    next();
  };
};

export default abilityMiddleware;
