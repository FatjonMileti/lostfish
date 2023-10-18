import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import {
  PropertyDocument,
  CountryCode,
  CurrencyCode,
  MasterAssetTypeSring,
  StatusString,
  TransactionTypeString,
  RentStatusString,
  BuildPurpose,
  Floor,
  House,
  OutsideSpace,
  ParkingDetails
} from '../property.interface';

const schema = new Schema<PropertyDocument>({
  asset_id: Number,
  name: { type: String },
  area_of_interest: String,
  description: { type: String },
  title: { type: String },
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
      type: String,
      enum: Object.values(CountryCode),
      default: CountryCode.GBR
    },
    text: { type: String }
  },
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
  status_string: {
    type: String,
    enum: [...Object.values(StatusString), ...Object.values(RentStatusString)],
    default: StatusString.Draft
  },
  transaction_type_string: {
    type: String,
    required: true,
    enum: Object.values(TransactionTypeString),
    default: TransactionTypeString.Rent
  },
  master_asset_type_string: {
    type: String,
    enum: Object.values(MasterAssetTypeSring)
  },
  property_type: {
    type: String
  },
  flat_details: {
    property_purpose: {
      type: String,
      enum: BuildPurpose,
      required: false
    },
    floor: {
      type: String,
      enum: Floor
    },

    lift: Boolean,
    security: Boolean,
    gym_spa: Boolean,
    outside_space: [
      {
        type: String,
        enum: OutsideSpace
      }
    ]
  },
  house_details: {
    house_type: {
      type: String,
      enum: House
    }
  },
  parking_details: {
    type: String,
    enum: ParkingDetails
  },
  currency_code: {
    type: String,
    enum: Object.values(CurrencyCode),
    default: CurrencyCode.GBP
  },
  floor_size: Number,
  floor_size_unit: String,
  asset_attribute: [Object],
  room_details: {
    number_of_bathrooms: Number,
    number_of_bedrooms: Number
  },
  budget: {
    min_budget: Number,
    max_budget: Number
  },
  parking_spot: Number,
  epc_rating: String,
  location_details: String,
  property_features: [String],
  specific_property_features: [String],
  credit_score_requirements: String,
  contract_details: [String],
  property_preference: String,
  asset_rent: {
    rental_amount: Number,
    rental_frequency: String,
    deposit_amount: { type: Number, default: null },
    interest_by: Date,
    available_from: Date
  },
  property_images: [{ type: Object }],
  settings: { type: Object, default: {} },
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<PropertyDocument, PaginateModel<PropertyDocument>>('property', schema);
