import { Schema, model, PaginateModel, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema<InvitationDocument>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  title: { type: String },
  invite_reason: { type: String },
  invite_type: { type: String },
  accepted: { type: Boolean, default: false },
  asset: { type: Schema.Types.ObjectId, ref: 'property' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);
export default model<InvitationDocument, PaginateModel<InvitationDocument>>('invitation', schema);

export interface InvitationDocument extends Document {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  accepted: boolean;
  invite_reason: string;
  invite_type: string;
  asset: Schema.Types.ObjectId;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}
