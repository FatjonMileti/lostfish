import { Document, ObjectId } from 'mongoose';

export interface RoomDocument extends Document {
  _id: ObjectId | string;
  author: ObjectId | string;
  participant: ObjectId | string;
  last_message?: any;
  created_at: Date;
}
