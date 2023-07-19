import { Document, ObjectId } from 'mongoose';

export type LookingForType = 'I’m looking for a place' | 'I own a place';
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
  property_type: string[];
  property_preferences: string[];
  property_features: string[];
  floor_size: string;
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  specific_property_features: string[];
  budget: string;
  deposit_amount: string;
  contact_details: string[];
  credit_score_requirements: string;
  transaction_type_string: string;
  floor_size_unit: string;
  currency_code: string;
  looking_for: LookingForEnum;
  moving_time: string;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
