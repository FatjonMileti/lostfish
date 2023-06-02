import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { NotificationDocument } from './notification.interface';

const schema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    entity: String,
    entity_id: { type: Schema.Types.ObjectId },
    viewed: { type: Boolean, default: false },
    dismissed: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    type: { type: String, required: true },
    message: String,
    data: Object
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

export default model<NotificationDocument, PaginateModel<NotificationDocument>>('notification', schema);
