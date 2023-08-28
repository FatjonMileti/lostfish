import { Schema, model, ObjectId, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

type IDocumentType = 'Rent Contract' | 'Lostfish transaction agreement' | 'Lostfish privacy agreement';

export interface IEnvelope extends Document {
  envelope_id: string;
  status: string;
  document_type: IDocumentType;
  status_date_time: Date;
  uri: string;
  sign_url_landlord: string;
  sign_url_tenant: string;
  sign_url_agent: string;
  signed_by_landlord: boolean;
  signed_by_tenant: boolean;
  signed_by_agent: boolean;
  land_lord: ObjectId;
  tenant: ObjectId;
  agent: ObjectId;
  property: ObjectId;
  created_at: Date;
  created_by?: ObjectId;
}

const schema = new Schema<IEnvelope>({
  envelope_id: String,
  status: String,
  status_date_time: Date,
  uri: String,
  document_type: { type: String },
  sign_url_landlord: String,
  sign_url_tenant: String,
  sign_url_agent: String,
  signed_by_landlord: { type: Boolean, default: false },
  signed_by_tenant: { type: Boolean, default: false },
  signed_by_agent: { type: Boolean, default: false },
  land_lord: { type: Schema.Types.ObjectId, ref: 'user' },
  tenant: { type: Schema.Types.ObjectId, ref: 'user' },
  agent: { type: Schema.Types.ObjectId, ref: 'user' },
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  created_at: { type: Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.virtual('can_download').get(function (this: IEnvelope) {
  return this.signed_by_landlord && this.signed_by_tenant;
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.plugin(mongoosePaginate);
export default model<IEnvelope, PaginateModel<IEnvelope>>('envelope', schema);
