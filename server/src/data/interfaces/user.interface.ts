import { Document, ObjectId } from "mongoose";

export interface UserDocument extends Document {
  _id: ObjectId | string;
  username: string;
  hash: string;
  role: {
    type: Role;
    default: Role.User;
  };
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  is_disabled: boolean;
  confirmation_token: string;
  address: {
    name: string;
    street: string;
  };
  last_login: Date;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

export enum Role {
  Admin = "Admin",
  Guest = "Guest",
  User = "User",
}
