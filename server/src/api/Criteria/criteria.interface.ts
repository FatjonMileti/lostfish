import { Document, ObjectId } from 'mongoose';

export interface CriteriaDocument extends Document {
  area_of_interest: string;
  radius: string;
  budget: string;
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
  transaction_type_string: string;
  property_type: string;
  asset_attribute: any[];
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  floor_size: number;
  floor_size_unit: string;
  property_features: string[];
  property_preference: string;

  asset_rent?: {
    rental_amount: number;
    rental_frequency: string;
    deposit_amount: number;
    interest_by: Date;
    available_from: Date;
  };
  specific_property_features: string[];
  property_images: object[];
  credit_score_requirements: string;
  preferences: string;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
