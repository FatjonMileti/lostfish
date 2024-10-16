import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CriteriaDocument, LookingForEnum } from '../criteria.interface';
import {
  BuildPurpose,
  FloorSizeUnit,
  HomeStyle,
  House,
  OutsideSpace,
  ParkingDetails,
  Floor,
  PropertyCondition,
  Range
} from '../../Property/property.interface';

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
  budget_for: String,
  property_type: [String],
  house_details: {
    house_type: [
      {
        type: [String],
        enum: House,
      }
    ],
    home_style: {
      type: String,
      enum: HomeStyle
    },
    preferred_size: {
      size: {
        min: Number,
        max: Number
      },
      unit: {
        type: String,
        enum: FloorSizeUnit
      }
    },
    condition: {
      type: String,
      enum: PropertyCondition
    },
    parking: {
      type: String,
      enum: ParkingDetails
    },
    garden: {
      size: {
        min: Number,
        max: Number
      },
      unit: {
        type: String,
        enum: FloorSizeUnit
      }
    },
    storeys: {
      min: Number,
      max: Number
    },
    number_of_bathrooms: {
      min: Number,
      max: Number
    },
    number_of_bedrooms: {
      min: Number,
      max: Number
    }
  },

  flat_details: {
    property_purpose: {
      type: String,
      enum: BuildPurpose
    },
    preferred_floor: {
      type: String,
      enum: Floor
    },
    condition: {
      type: String,
      enum: PropertyCondition
    },
    outside_space: [
      {
        type: String,
        enum: OutsideSpace
      }
    ],
    preferred_size: {
      size: {
        min: Number,
        max: Number
      },
      unit: {
        type: String,
        enum: FloorSizeUnit
      }
    },
    number_of_bathrooms: {
      min: Number,
      max: Number
    },
    number_of_bedrooms: {
      min: Number,
      max: Number
    },

    lift: Boolean,
    security: Boolean,
    parking_space: Boolean,
    gym_spa: Boolean
  },
  property_preferences: [String],
  property_features: [String],
  floor_size: String,
  room_details: {
    number_of_bathrooms: String,
    number_of_bedrooms: String
  },

  parking_details: [String],
  floor_size_unit: String,
  specific_property_features: [String],
  budget: {
    min: Number,
    max: Number
  },
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
    value: {
      min: Number,
      max: Number
    },
    unit: String
  },
  distance_from_schools: {
    value: {
      min: Number,
      max: Number
    },
    unit: String
  },
  distance_from_high_street: {
    value: {
      min: Number,
      max: Number
    },
    unit: String
  },
  distance_from_gym: {
    value: {
      min: Number,
      max: Number
    },
    unit: String
  },
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' }
});

schema.plugin(mongoosePaginate);

export default model<CriteriaDocument, PaginateModel<CriteriaDocument>>('criteria', schema);
