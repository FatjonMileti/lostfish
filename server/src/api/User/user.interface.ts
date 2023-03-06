import { Document, ObjectId } from 'mongoose';

export interface UserDocument extends Document {
  _id: ObjectId | string;
  username: string;
  hash: string;
  role: Role;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;

  isDisabled: boolean;
  lastLogin: Date;

  editedAt?: Date;
  editedBy?: ObjectId | string;
  createdAt: Date;
  createdBy?: ObjectId | string;
}

export enum Role {
  Admin = 'Admin'
}
