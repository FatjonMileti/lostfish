import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import {
  Access,
  AssetAtribute,
  AssetDocument,
  AssetTypeString,
  CountryCode,
  CurrencyCode,
  MasterAssetTypeSring,
  RentalFrequency,
  StatusString,
  TabName,
  TransactionTypeString,
  IOffer,
  RentStatusString
} from '../asset.interface';

const Contact = {
  firstname: { type: String, required: true },
  surname: { type: String, required: true },
  legal_name: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
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
  radius: String,
  asset_address: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    street_number: String,
    route: String,
    neighbourhood: String,
    postal_town: String,
    postal_code: { type: String },
    administrative_area_level_1: String,
    country_code: {
      type: String,
      enum: Object.values(CountryCode),
      default: null
    },
    text: { type: String, required: true }
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
    default: null
  },
  master_asset_type_string: {
    type: String,
    enum: Object.values(MasterAssetTypeSring)
  },
  asset_type_string: {
    type: String,
    enum: Object.values(AssetTypeString)
  },
  property_type: {
    type: String,
    required: true,
    enum: Object.values(AssetTypeString)
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
  property_features: [String],
  specific_property_features: [String],
  property_preference: String,
  asset_sale: { type: AssetSale, default: null },
  asset_rent: {
    rental_amount: Number,
    rental_frequency: {
      type: String,
      enum: Object.values(RentalFrequency),
      default: RentalFrequency.Month,
      _id: false
    },
    deposit_amount: { type: Number, default: null },
    interest_by: Date,
    available_from: Date
  },
  asset_auction: {
    guide_price: Number,
    reserve_price: Number,
    starting_bid: Number,
    bidding_increments: { type: Number, default: 1000 },
    start_time: Date,
    end_time: Date,
    bidding_extension: Number,
    deposit_due_date: Date,
    completion_date: Date
  },
  client_id: { type: Number, default: null },
  client: { type: Contact, default: null },
  solicitor_id: { type: Number, default: null },
  solicitor: { type: Contact, default: null },
  statistics: { type: Object, default: {} },
  offers: [{ type: Object }],

  property_images: [{ type: Object }],
  permission: {
    administrator_names: [String],
    display_administrator_names: [String],
    branch_administrator_names: [String],
    access: {
      type: String,
      enum: Object.values(Access),
      default: Access.flexible,
      _id: false
    },
    tabs: [
      {
        name: {
          type: String,
          enum: Object.keys(TabName),
          default: null
        },
        roles: [String],
        _id: false
      }
    ]
  },
  settings: { type: Object, default: {} },
  preferences: String,
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<AssetDocument, PaginateModel<AssetDocument>>('asset', schema);

//making offer is not duable
//
