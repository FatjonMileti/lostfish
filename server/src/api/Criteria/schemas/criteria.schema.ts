import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CriteriaDocument, LookingForEnum } from '../criteria.interface';

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
  budgetFor: String,
  property_type: [String],
  property_preferences: [String],
  property_features: [String],
  floor_size: String,
  room_details: {
    number_of_bathrooms: String,
    number_of_bedrooms: String
  },
  flat_details: {
    property_purpose: String,
    floor: Number,
    lift: Boolean,
    security: Boolean
  },
  parking_details: [String],
  floor_size_unit: String,
  specific_property_features: [String],
  budget: String,
  deposit_amount: String,
  contract_details: [String],
  credit_score_requirements: String,
  transaction_type_string: {
    type: String,
    required: true
  },
  outside_space: [String],
  currency_code: String,
  looking_for: { type: String, enum: LookingForEnum },
  moving_time: String,
  distance_from_underground: {
    value: Number,
    unit: String
  },
  distance_from_schools: {
    value: Number,
    unit: String
  },
  distance_from_high_street: {
    value: Number,
    unit: String
  },
  distance_from_gym: {
    value: Number,
    unit: String
  },
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<CriteriaDocument, PaginateModel<CriteriaDocument>>('criteria', schema);
