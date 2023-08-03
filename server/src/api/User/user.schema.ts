import { model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserDocument, Role } from './user.interface';

const schema: Schema<UserDocument> = new Schema<UserDocument>({
  hash: { type: String, default: null },
  role: {
    type: String,
    default: Role.Client
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
  notification: {
    email_me_when_i_get_a_match: { type: Boolean, default: false },
    text_when_i_get_a_match: { type: Boolean, default: false },
    email_when_someone_accept_my_match: { type: Boolean, default: false },
    text_when_someone_accept_my_match: { type: Boolean, default: false }
  },
  documents: [Object],
  description: String,
  avatar: String,
  confirmation_token: String,
  last_login: Date,
  address: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  deleted_at: { type: Date, default: undefined }
});

schema.pre(/^find/, function (next) {
  this.find({ deleted_at: { $exists: false } });
  next();
});

schema.plugin(mongoosePaginate);

export default model<UserDocument, PaginateModel<UserDocument>>('user', schema);
