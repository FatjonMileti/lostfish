import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CriteriaDocument } from '../criteria.interface';

const schema = new Schema<CriteriaDocument>({
  area_of_interest: String,
  asset_address: {
    latitude: { type: Number },
    longitude: { type: Number },
    street_number: String,
    route: String,
    neighbourhood: String,
    postal_town: String,
    postal_code: { type: String },
    administrative_area_level_1: String,
    country_code: {
      type: String
    },
    text: { type: String }
  },
  radius: String,
  property_type: [String],
  property_preferences: [String],
  property_features: [String],
  floor_size: String,
  room_details: {
    number_of_bathrooms: String,
    number_of_bedrooms: String
  },
  specific_property_features: [String],
  budget: String,
  deposit_amount: String,
  contact_details: [String],
  credit_score_requirements: String,
  transaction_type_string: {
    type: String,
    required: true
  },
  floor_size_unit: String,
  currency_code: String,
  looking_for: String,
  moving_time: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<CriteriaDocument, PaginateModel<CriteriaDocument>>('criteria', schema);
