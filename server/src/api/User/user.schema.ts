import { Schema, model, PaginateModel } from 'mongoose';
import { Role, UserDocument } from './user.interface';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema<UserDocument>({
  username: { type: String, index: true, required: true, unique: true }, //email
  hash: { type: String, select: false },
  role: {
    type: String,
    enum: [Role.Admin],
    required: true
  },
  email: String,
  phone: String,
  firstName: String,
  lastName: String,

  isDisabled: { type: Boolean },
  lastLogin: Date,

  editedAt: Date,
  editedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  createdAt: { type: Date, required: true, default: () => new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' }
});
schema.plugin(mongoosePaginate);

export const UserModel = model<UserDocument, PaginateModel<UserDocument>>('user', schema);
