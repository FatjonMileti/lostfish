import { Document, ObjectId } from 'mongoose';

export interface UserDocument extends Document {
  hash: string;
  role: {
    type: Role;
    default: Role.User;
  };
  email: string;
  first_name: string;
  last_name: string;
  is_disabled: boolean;
  google: {
    username: string;
    google_user_id: string;
    is_google_verified: boolean;
  };
  facebook: {
    username: string;
    facebook_user_id: string;
    is_facebook_verified: boolean;
  };
  twitter: {
    username: string;
    twitter_user_id: string;
    is_twitter_verified: boolean;
  };
  address?: {
    name: string;
    street: string;
  };
  phone?: string;
  confirmation_token?: string;
  last_login: Date;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

export enum Role {
  Admin = 'Admin',
  Guest = 'Guest',
  User = 'User'
}
