import { Document, Types, Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Interface for the document
export interface DocumentInterface extends Document {
  tenant: Types.ObjectId;
  landlord: Types.ObjectId;
  approved: boolean;
  file: any[];
  created_at: Date;
  updated_at?: Date;
  created_by?: Types.ObjectId;
}

const documentSchema = new Schema<DocumentInterface>({
  tenant: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  landlord: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  approved: { type: Boolean, default: false },
  file: [{ type: Schema.Types.Mixed }],
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

documentSchema.plugin(mongoosePaginate);

export default model<DocumentInterface, PaginateModel<DocumentInterface>>('document', documentSchema);
