import { Schema, model, Model, Document, Types } from 'mongoose';

const schema = new Schema<PropertyViewDocument>({
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Types.ObjectId, ref: 'user' }
});

export default model<PropertyViewDocument, Model<PropertyViewDocument>>('property-view', schema);

export interface PropertyViewDocument extends Document {
  property: string | Schema.Types.ObjectId;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}
