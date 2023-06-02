import { Document, ObjectId } from 'mongoose';

export interface ChatDocument extends Document {
  _id: ObjectId | string;
  room_id: ObjectId | string;
  author: ObjectId | string;
  participant: ObjectId | string;
  message: string;
  sender: ObjectId | string;
  seen: boolean;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
