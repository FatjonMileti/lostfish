import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { RoomDocument } from '../room.interface';

const schema = new Schema<RoomDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  participant: { type: Schema.Types.ObjectId, ref: 'user' },
  last_message: { type: Schema.Types.ObjectId, ref: 'message' },
  created_at: { type: Date, required: true, default: () => new Date() }
});

schema.plugin(mongoosePaginate);

export default model<RoomDocument, PaginateModel<RoomDocument>>('room', schema);
