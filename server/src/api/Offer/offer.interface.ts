import { Document, ObjectId } from 'mongoose';

type ObjectIdField = ObjectId | string;

export interface OfferDocument extends Document {
  _id: ObjectId;
  match: ObjectIdField;
  offering_price: number;
  warranty: string;
  min_duration: string;
  canceled?: boolean;
  property: ObjectIdField;
  created_by: ObjectIdField;
  created_for: ObjectIdField;
  refused: boolean;
  accepted: {
    accepted_date: Date;
    status: boolean;
  };
  created_at: Date;
}
