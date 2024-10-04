import { Document, ObjectId } from 'mongoose';
import {
  BuildPurpose,
  FloorSizeUnit,
  HomeStyle,
  House,
  OutsideSpace,
  ParkingDetails,
  Floor,
  PropertyCondition,
  PropertyType,
  Range, DistanceUnit
} from '../Property/property.interface';

export enum LookingForEnum {
  LOOKING_FOR_PLACE = 'I’m looking for a place',
  OWN_A_PLACE = 'I own a place'
}

export interface CriteriaDocument extends Document {
  area_of_interest: string;
  asset_address: {
    latitude: number;
    longitude: number;
    street_number?: string;
    route?: string;
    neighbourhood?: string;
    postal_town?: string;
    postal_code?: string;
    administrative_area_level_1?: string;
    country_code?: string;
    text?: string;
  };
  radius: string;
  budget_for: string;

  property_type: PropertyType[];

  house_details: {
    house_type?: {
      type: [String],
      required: true,
    },
    home_style?: {
      type: String,
      required: true,
    },
    preferred_size: {
      size: Range;
      unit: FloorSizeUnit;
    };
    condition?: PropertyCondition;
    parking?: ParkingDetails;
    garden: {
      size: Range;
      unit: FloorSizeUnit;
    };
    storeys: Range;
    number_of_bathrooms: Range;
    number_of_bedrooms: Range;
  };

  flat_details: {
    property_purpose: BuildPurpose;
    preferred_floor?: Floor;
    condition?: PropertyCondition;
    outside_space: OutsideSpace[];
    preferred_size: {
      size: Range;
      unit: FloorSizeUnit;
    };
    number_of_bathrooms: Range;
    number_of_bedrooms: Range;
    lift: boolean;
    security: boolean;
    parking_space: boolean;
    gym_spa: boolean;
  };

  property_preferences: string[];
  property_features: string[];
  floor_size: string;
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  specific_property_features: string[];
  parking_details: ParkingDetails[];

  distance_from_underground: {
    value: Range;
    unit: DistanceUnit;
  };
  distance_from_schools: {
    value: Range;
    unit: DistanceUnit;
  };
  distance_from_high_street: {
    value: Range;
    unit: DistanceUnit;
  };
  distance_from_gym: {
    value: Range;
    unit: DistanceUnit;
  };

  outside_space: OutsideSpace[];
  budget: Range;
  deposit_amount: string;
  contract_details: string[];
  credit_score_requirements: string;
  transaction_type_string: string;
  floor_size_unit: FloorSizeUnit;
  currency_code: string;
  looking_for: LookingForEnum;
  moving_time: string;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

