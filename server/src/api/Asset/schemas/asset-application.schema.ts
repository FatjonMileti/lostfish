import { Schema, model, PaginateModel, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

enum ApproveType {
  PRE_APPROVE = 'Pre approval',
  APPROVE = 'Approval'
}

const schema = new Schema<ApplicationDocument>({
  applicant: { type: Types.ObjectId, ref: 'user' },
  asset: { type: Schema.Types.ObjectId, ref: 'asset' },
  have_pets: { type: Boolean, default: false },
  adults_number: { type: Number, required: true },
  participants: [String],
  approve_type: String,
  approve_status: { type: Boolean, default: false },
  agreed_terms: { type: Boolean, default: false },
  moving_date: Date,
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);
export default model<ApplicationDocument, PaginateModel<ApplicationDocument>>('application', schema);

export interface ApplicationDocument extends Document {
  moving_date: Date;
  have_pets: boolean;
  adults_number: number;
  participants: any[];
  applicant: Schema.Types.ObjectId;
  asset: Schema.Types.ObjectId;
  approve_type: any;
  approve_status: boolean;
  agreed_terms: boolean;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}
