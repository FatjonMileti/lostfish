import { model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserDocument, Role } from './user.interface';

function calculateProfileCompleteness(user: UserDocument): number {
  let completeness = 0;

  // Calculate completeness based on each criteria
  if (user.signed_transaction_agreement) completeness += 30;
  if (user.avatar) completeness += 5;
  if (user.first_name && user.last_name && user.email) completeness += 5;
  if (user.description) completeness += 5;
  if (user.agreed_application_policy) completeness += 20;
  if (user.address) completeness += 5;

  const numDocuments = user.documents ? user.documents.length : 0;
  if (numDocuments >= 1 && user.documents[0].key) completeness += 10;
  if (numDocuments >= 2 && user.documents[1].key) completeness += 10;
  if (numDocuments >= 3 && user.documents[2].key) completeness += 10;

  completeness = Math.min(100, completeness);

  return completeness;
}

const schema: Schema<UserDocument> = new Schema<UserDocument>({
  hash: { type: String, default: null, select: false },
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
  agreed_application_policy: { type: Boolean, default: false },
  signed_transaction_agreement: { type: Boolean, default: false },
  transaction_agreement_link: { type: String, default: undefined },
  last_login: Date,
  address: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  deleted_at: { type: Date, default: undefined }
});

schema.virtual('is_deleted').get(function () {
  return this.deleted_at !== undefined;
});

schema.virtual('has_transaction_agreement').get(function () {
  return !!this.transaction_agreement_link;
});

schema.virtual('trust_score').get(function (this: UserDocument) {
  return calculateProfileCompleteness(this);
});
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.plugin(mongoosePaginate);

export default model<UserDocument, PaginateModel<UserDocument>>('user', schema);
