import { Schema, model, ObjectId, Document, PaginateModel } from 'mongoose';
import { Role } from '../enums';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends Document {
  _id: ObjectId | string;
  username: string;
  hash: string;
  role: Role;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;

  isDisabled: boolean;
  lastLogin: Date;

  editedAt?: Date;
  editedBy?: ObjectId | string;
  createdAt: Date;
  createdBy?: ObjectId | string;
}

const schema = new Schema<IUser>({
  username: { type: String, index: true, required: true, unique: true }, //email
  hash: String,
  role: {
    type: String,
    enum: [Role.Admin],
    required: true
  },
  email: String,
  phone: String,
  firstName: String,
  lastName: String,

  isDisabled: { type: Boolean, required: true },
  lastLogin: Date,

  editedAt: Date,
  editedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  createdAt: { type: Date, required: true, default: () => new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' }
});
schema.plugin(mongoosePaginate);

export default model<IUser, PaginateModel<IUser>>('user', schema);
