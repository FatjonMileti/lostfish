import { Document, ObjectId } from 'mongoose';

export interface RoomDocument extends Document {
  author: ObjectId | string;
  participant: ObjectId | string;
  property: ObjectId | string;
  last_message?: any;
  created_at?: Date;
}
