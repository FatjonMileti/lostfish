import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import {
  AssetDocument,
  CountryCode,
  CurrencyCode,
  MasterAssetTypeSring,
  StatusString,
  TransactionTypeString,
  RentStatusString
} from '../asset.interface';

const Contact = {
  firstname: { type: String, required: true },
  surname: { type: String, required: true },
  legal_name: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String, default: null },
  contact_type: {
    type: String,
    enum: ['Client', 'Solicitor', 'Agent', 'Unknown'],
    default: null
  },
  address: { type: String, default: null }
};

const AssetSale = {
  asking_price: { type: Number },
  minimum_offer: { type: Number, default: 0 },
  offer_increment_amount: { type: Number, default: 1000 },
  date_go_live: Date,
  date_offer_deadline: Date,
  date_exchanged: Date,
  date_completion: Date,
  offers_extension: { type: Number, default: 1 },
  contract_deposit_percent: Number,
  booking_deposit_amount: Number,
  special_conditions: String,
  show_all_offers: { type: Boolean, default: true },
  show_highest_offer: { type: Boolean, default: true },
  enable_downward_bidding: { type: Boolean, default: true },
  downward_bidding_allowed_percentage: { type: Number, default: 5 }
};

const schema = new Schema<AssetDocument>({
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
  currency_code: {
    type: String,
    enum: Object.values(CurrencyCode),
    default: CurrencyCode.GBP
  },
  floor_size: Number,
  floor_size_unit: String,
  buyers: [Object],
  reserved: { type: Boolean, default: null },
  master_branch_name: String,
  extra_branch_names: [String],
  walkthrough_url: { type: String, default: null },
  videos: [{ name: String, url: String }],
  asset_files: [Object],
  asset_attribute: [Object],
  room_details: {
    number_of_bathrooms: String,
    number_of_bedrooms: String
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
  asset_sale: { type: AssetSale, default: null },
  asset_rent: {
    rental_amount: Number,
    rental_frequency: String,
    deposit_amount: { type: Number, default: null },
    interest_by: Date,
    available_from: Date
  },
  client_id: { type: Number, default: null },
  client: { type: Contact, default: null },
  solicitor_id: { type: Number, default: null },
  solicitor: { type: Contact, default: null },
  statistics: { type: Object, default: {} },
  property_images: [{ type: Object }],
  settings: { type: Object, default: {} },
  preferences: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<AssetDocument, PaginateModel<AssetDocument>>('asset', schema);
