import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CriteriaDocument } from '../criteria.interface';

const schema = new Schema<CriteriaDocument>({
  area_of_interest: String,
  budget: { type: String },
  radius: String,
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
  transaction_type_string: {
    type: String,
    required: true
  },
  property_type: {
    type: String
  },
  floor_size: Number,
  floor_size_unit: String,
  asset_attribute: [Object],
  room_details: {
    number_of_bathrooms: String,
    number_of_bedrooms: String
  },
  property_features: [String],
  specific_property_features: [String],
  credit_score_requirements: String,
  property_preference: String,
  asset_rent: {
    rental_amount: Number,
    rental_frequency: String,
    deposit_amount: { type: Number, default: null },
    interest_by: Date,
    available_from: Date
  },
  preferences: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<CriteriaDocument, PaginateModel<CriteriaDocument>>('criteria', schema);
