import { model, PaginateModel, Schema } from 'mongoose';
import { Role } from '../../enums';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserDocument } from './user.interface';

const schema = new Schema<UserDocument>({
  hash: String,
  role: {
    type: String,
    enum: [Role.Admin, Role.User],
    default: Role.User
  },
  email: {
    type: String,
    index: true,
    validate: {
      validator(this: UserDocument, value: string): boolean {
        return (
          (this?.twitter?.username && (value === null || value === undefined)) ||
          (value !== null && value !== undefined)
        );
      },
      message: 'Email is required when twitter username is not present.'
    }
  },
  phone: String,
  first_name: String,
  last_name: String,
  is_disabled: { type: Boolean, default: true },
  google: {
    username: String,
    google_user_id: String,
    is_google_verified: { type: Boolean, default: false }
  },
  facebook: {
    username: String,
    facebook_user_id: String,
    is_facebook_verified: { type: Boolean, default: false }
  },
  twitter: {
    username: String,
    twitter_user_id: String,
    is_twitter_verified: { type: Boolean, default: false }
  },
  confirmation_token: String,
  last_login: Date,
  address: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<UserDocument, PaginateModel<UserDocument>>('user', schema);
