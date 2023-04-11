import { Document, ObjectId } from 'mongoose';

export interface UserDocument extends Document {
  _id: ObjectId | string;
  username: string;
  hash: string;
  role: Role;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  is_disabled: boolean;
  last_login: Date;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

export enum Role {
  Admin = 'Admin',
  Guest = 'Guest'
}
