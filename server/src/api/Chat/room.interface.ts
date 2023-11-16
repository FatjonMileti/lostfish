import { Document, ObjectId } from 'mongoose';

export interface RoomDocument extends Document {
  author: ObjectId | string;
  participant: ObjectId | string;
  property: ObjectId | string;
  tenant: ObjectId | string;
  last_message?: any;

  tenant_match: ObjectId | string;
  property_match: ObjectId | string;
  created_at?: Date;
}

export interface PopulatedRoomDocument extends RoomDocument {
  author: any;
  participant: any;
}
