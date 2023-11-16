import { Schema, model, PaginateModel, ObjectId } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { RoomDocument } from '../room.interface';

const schema = new Schema<RoomDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  participant: { type: Schema.Types.ObjectId, ref: 'user' },
  last_message: { type: Schema.Types.ObjectId, ref: 'message' },
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  tenant: { type: Schema.Types.ObjectId, ref: 'user' },
  tenant_match: { type: Schema.Types.ObjectId, ref: 'match' },
  property_match: { type: Schema.Types.ObjectId, ref: 'match' },
  created_at: { type: Date, required: true, default: () => new Date() }
});

schema.plugin(mongoosePaginate);

export default model<RoomDocument, PaginateModel<RoomDocument>>('room', schema);
