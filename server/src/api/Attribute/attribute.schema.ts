import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AttributeDocument, IType } from './attribute.interface';

const schema = new Schema<AttributeDocument>({
  attribute_id: { type: Number, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  fieldset: { type: String, required: true },
  type: { type: String, enum: IType, required: true },
  required: Boolean,
  multiple: String,
  max_length: Number,
  min_value: Number,
  max_value: Number,
  pattern: String,
  option: [{ group: String, label: { type: String, required: true } }],
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<AttributeDocument, PaginateModel<AttributeDocument>>('attribute', schema);
