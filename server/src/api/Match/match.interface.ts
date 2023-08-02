import { Document, ObjectId } from 'mongoose';

type ObjectIdField = ObjectId | string;

export enum MatchingType {
  PROPERTY = 'Property',
  USER = 'User'
}
export interface MatchDocument extends Document {
  property: ObjectIdField;
  tenant: ObjectIdField;
  landlord: ObjectIdField;
  chosen: boolean;
  starred: boolean;
  type: MatchingType;
  created_by?: ObjectIdField | string;
  edited_by?: ObjectIdField | string;
  created_at: Date;
  edited_at?: Date;
}
