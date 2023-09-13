import { Document, ObjectId } from 'mongoose';

export enum CountryCode {
  'IRL' = 'IRL',
  'GBR' = 'GBR',
  'AUS' = 'AUS',
  'NZL' = 'NZL',
  'USA' = 'USA',
  'FRA' = 'FRA',
  'DEU' = 'DEU',
  'ESP' = 'ESP',
  'PRT' = 'PRT',
  'BEL' = 'BEL',
  'NLD' = 'NLD',
  'ITA' = 'ITA',
  'HRV' = 'HRV',
  'ZAF' = 'ZAF',
  'KEN' = 'KEN',
  'ARE' = 'ARE',
  'CAN' = 'CAN',
  'AL' = 'AL'
}

export enum PropertyPreferences {
  NewHome = 'New home',
  RetirementHome = 'Retirement home',
  SharedOwnership = 'Shared ownership',
  Auction = 'Auction'
}

export enum PropertyFeatures {
  ParksNearby = 'Parks nearby',
  PublicTransportNearby = 'Public transport nearby',
  ShoppingCentersNearby = 'Shopping centers nearby'
}

export enum ParkingDetails {
  Garage = 'Garage',
  OffStreet = 'Off street',
  OnStreet = 'On street'
}

export enum OutsideSpace {
  Garden = 'Garden',
  Balcony = 'Balcony',
  RoofTerrace = 'Roof terrace'
}

export enum SpecificPropertyFeatures {
  PARKING_SPOT = 'Parking spot',
  GARDEN = 'Garden',
  TERRACE = 'Terrace',
  FULLY_FURNISHED = 'Fully furnished',
  PARTIALLY_FURNISHED = 'Partially furnished',
  UNFURNISHED = 'Unfurnished',
  DOUBLE_GLAZING = 'Double glazing',
  ALLOWS_SMOKING = 'Allows smoking',
  ALLOW_PETS = 'Allows pets',
  CLOSE_PUBLIC_TRANSPORT = 'Close to public transport'
}

export enum StatusString {
  Draft = 'Draft',
  Live = 'Live',
  SaleAgreed = 'Sale Agreed',
  Exchanged = 'Exchanged',
  Completed = 'Completed',
  Archived = 'Archived',
  PreDraft = 'Pre Draft'
}

export enum RentStatusString {
  Draft = 'Draft',
  Let = 'Let',
  LetAgreed = 'Let Agreed',
  ForLet = 'For Let',
  Completed = 'Completed',
  Archived = 'Archived',
  PreDraft = 'Pre Draft'
}

export enum TransactionTypeString {
  Sale = 'Sale',
  Auction = 'Auction',
  Tender = 'Tender',
  Rent = 'Rent'
}

export enum MasterAssetTypeSring {
  Unknown = 'Unknown',
  Residential = 'Residential',
  Commercial = 'Commercial',
  Marine = 'Marine'
}

export enum PropertyType {
  'Detached' = 'Detached',
  'Semi-Detached' = 'Semi-Detached',
  'Terraced' = 'Terraced',
  'Flats' = 'Flats',
  'Bungalows' = 'Bungalows',
  'Farms/Land' = 'Farms/Land'
}

export enum CurrencyCode {
  'EUR' = 'EUR',
  'GBP' = 'GBP',
  'USD' = 'USD',
  'AUD' = 'AUD',
  'ZAR' = 'ZAR',
  'CHF' = 'CHF',
  'KES' = 'KES'
}

export enum RentalFrequency {
  'Day' = 'Day',
  'Week' = 'Week',
  '2week' = '2week',
  '4week' = '4week',
  'Month' = 'Month',
  'Year' = 'Year'
}

export enum CreditScoreRequirement {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair'
}

export enum ContractDetails {
  guarantor = 'guarantor',
  reviewedProperty = 'reviewedProperty',
  energyCertificate = 'energyCertificate'
}

export enum FloorSizeUnit {
  SQR_FT = 'sq.ft',
  SQR_MTRS = 'sq.m'
}

export interface PropertyDocument extends Document {
  asset_id: number;
  name: string;
  area_of_interest: string;
  frequency: string;
  radius: string;
  description: string;
  title: string;
  asset_address: {
    latitude: number;
    longitude: number;
    street_number: string;
    route: string;
    neighbourhood: string;
    postal_town: string;
    postal_code: string;
    administrative_area_level_1: string;
    country_code: CountryCode;
    text: string;
  };
  status_string: StatusString | RentStatusString;
  transaction_type_string: TransactionTypeString;
  master_asset_type_string: MasterAssetTypeSring;
  property_type: PropertyType;
  currency_code: CurrencyCode;
  outside_space: OutsideSpace[];
  flat_details: {
    property_purpose: string;
    floor: number;
    lift: boolean;
    security: boolean;
  };
  parking_details: ParkingDetails[];
  asset_attribute: any[];
  room_details: {
    number_of_bathrooms: number;
    number_of_bedrooms: number;
  };
  budget: {
    min_budget: number;
    max_budget: number;
  };
  parking_spot: number;
  epc_rating: string;
  location_details: string;
  floor_size: number;
  floor_size_unit: FloorSizeUnit;
  property_features: PropertyFeatures[];
  property_preference: PropertyPreferences;
  asset_rent: {
    rental_amount: number;
    rental_frequency: RentalFrequency;
    deposit_amount: number;
    interest_by: Date;
    available_from: Date;
  };
  statistics: any;
  specific_property_features: SpecificPropertyFeatures[];
  property_images: object[];
  credit_score_requirements: CreditScoreRequirement;
  contract_details: ContractDetails[];
  settings: any;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
