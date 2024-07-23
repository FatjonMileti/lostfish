import { Schema, model, PaginateModel, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema<PropertyDetailDocument>({
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  views: { type: Number, default: () => 0 },
  matches: { type: Number, default: () => 0 },
  property_score: { type: Number, default: () => 0 },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);
export default model<PropertyDetailDocument, PaginateModel<PropertyDetailDocument>>(
  'property-detail',
  schema
);

export interface PropertyDetailDocument extends Document {
  property: string | Schema.Types.ObjectId;
  views: number;
  matches: number;
  property_score: number;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}
