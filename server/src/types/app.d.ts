import jwt from 'jsonwebtoken';
import { Role } from '../enums';

declare module 'express' {
  interface Response {
    locals: {
      model?: object;
      claims?: jwt.JwtPayload;
      user_id?: string;
      username?: string;
      token?: string;
      role?: Role;
      paging_options?: object;
    };
  }
  interface Request {
    ability?: any;
    user?: any;
  }
}

declare module 'express-session' {
  interface Session {
    color?: string;
  }
}
