import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ConditionDocument, IType } from './condition.interface';

const schema = new Schema<ConditionDocument>({
  condition_id: Number,
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String },
  help: { type: String },
  type_string: { type: String, enum: IType, required: true },
  required: { type: Boolean, default: false },
  is_system: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<ConditionDocument, PaginateModel<ConditionDocument>>('condition', schema);
