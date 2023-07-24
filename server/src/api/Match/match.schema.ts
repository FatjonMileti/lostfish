import { model, Schema, PaginateModel, Query, ObjectId } from 'mongoose';
import { MatchingType, MatchDocument } from './match.interface';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IMatchQueryParams {
  _id?: ObjectId | string;
  chosen?: boolean;
  starred?: boolean;
  type?: MatchingType;
  created_by?: ObjectId | string;
}

const schema: Schema<MatchDocument> = new Schema<MatchDocument>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'user' },
    chosen: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    type: { type: String, enum: MatchingType },
    property: { type: Schema.Types.ObjectId, ref: 'asset' },
    edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
    created_by: { type: Schema.Types.ObjectId, ref: 'user' },
    created_at: { type: Date, default: () => new Date() },
    edited_at: { type: Date }
  },
  {
    versionKey: false
  }
);

schema.plugin(mongoosePaginate);
export default model<MatchDocument, PaginateModel<MatchDocument>>('match', schema);
