import { Document, Types, Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Interface for the document
export interface DocumentInterface extends Document {
  tenant: Types.ObjectId;
  landlord: Types.ObjectId;
  file: any[];
  created_at: Date;
  approved: boolean; // Virtual property
  updated_at?: Date;
  created_by?: Types.ObjectId;
}

const documentSchema = new Schema<DocumentInterface>({
  tenant: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  landlord: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  file: [{ type: Schema.Types.Mixed }],
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

documentSchema.plugin(mongoosePaginate);

documentSchema.virtual('approved').get(function (this: DocumentInterface) {
  return this.file.every((file) => file.approved);
});
documentSchema.set('toObject', { virtuals: true });
documentSchema.set('toJSON', { virtuals: true });

export default model<DocumentInterface, PaginateModel<DocumentInterface>>('document', documentSchema);
