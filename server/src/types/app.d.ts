import jwt from "jsonwebtoken";
import { Role } from "../enums";

declare module "express" {
  interface Response {
    locals: {
      model?: object;
      claims?: jwt.JwtPayload;
      userId?: string;
      username?: string;
      token?: string;
      role?: Role;
      pagingOptions?: object;
    };
  }
}

declare module "express-session" {
  interface Session {
    color?: string;
  }
}
