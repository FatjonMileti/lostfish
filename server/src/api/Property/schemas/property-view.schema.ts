import { Schema, model, PaginateModel, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema<PropertyViewDocument>({
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);
export default model<PropertyViewDocument, PaginateModel<PropertyViewDocument>>('property-view', schema);

export interface PropertyViewDocument extends Document {
  property: string | Schema.Types.ObjectId;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}
