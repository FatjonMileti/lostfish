import { Document, ObjectId } from 'mongoose';
import { FloorSizeUnit, OutsideSpace, ParkingDetails } from '../Property/property.interface';

export enum LookingForEnum {
  LOOKING_FOR_PLACE = 'I’m looking for a place',
  OWN_A_PLACE = 'I own a place'
}

export interface CriteriaDocument extends Document {
  area_of_interest: string;
  asset_address: {
    latitude: number;
    longitude: number;
    street_number: string;
    route: string;
    neighbourhood: string;
    postal_town: string;
    postal_code: string;
    administrative_area_level_1: string;
    country_code: string;
    text: string;
  };
  radius: string;
  budget_for: string;
  property_type: string[];
  property_preferences: string[];
  property_features: string[];
  floor_size: string;
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  specific_property_features: string[];
  parking_details: ParkingDetails;
  flat_details: {
    property_purpose: string;
    floor: number;
    lift: boolean;
    security: boolean;
  };
  distance_from_underground: {
    value: number;
    unit: string;
  };
  distance_from_schools: {
    value: number;
    unit: string;
  };
  distance_from_high_street: {
    value: number;
    unit: string;
  };
  distance_from_gym: {
    value: number;
    unit: string;
  };
  outside_space: OutsideSpace[];
  budget: string;
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
