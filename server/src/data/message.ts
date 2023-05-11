import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ChatDocument } from './interfaces/chat.interface';

const schema = new Schema<ChatDocument>({
  room_id: { type: Schema.Types.ObjectId, ref: 'room' },
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  participant: { type: Schema.Types.ObjectId, ref: 'user' },
  message: String,
  sender: { type: Schema.Types.ObjectId, ref: 'user' },
  seen: { type: Boolean, default: false },
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<ChatDocument, PaginateModel<ChatDocument>>('message', schema);
