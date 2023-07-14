import { Schema, model, ObjectId, Document } from 'mongoose';

export interface IEnvelope extends Document {
  envelope_id: string;
  status: string;
  status_date_time: Date;
  uri: string;
  sign_url_landlord: string;
  sign_url_tenant: string;
  land_lord: ObjectId;
  tenant: ObjectId;
  created_by?: ObjectId;
}

const schema = new Schema<IEnvelope>({
  envelope_id: String,
  status: String,
  status_date_time: Date,
  uri: String,
  sign_url_landlord: String,
  sign_url_tenant: String,
  land_lord: { type: Schema.Types.ObjectId, ref: 'user' },
  tenant: { type: Schema.Types.ObjectId, ref: 'user' },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IEnvelope>('envelope', schema);
