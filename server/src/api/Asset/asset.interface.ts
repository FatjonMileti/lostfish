import { Document, ObjectId } from 'mongoose';

export enum ContactType {
  Client = 'Client',
  Solicitor = 'Solicitor',
  Agent = 'Agent',
  Unknown = 'Unknown'
}

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

export interface ContactDocument extends Document {
  firstname: string;
  surname: string;
  legal_name: { type: string };
  email: string;
  phone: string;
  company: string;
  contact_type: ContactType;
  address: string;
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

export enum Access {
  'flexible' = 'flexible',
  'strict' = 'strict',
  'semi_strict' = 'semi_strict'
}

export enum RentalFrequency {
  'Day' = 'Day',
  'Week' = 'Week',
  '2week' = '2week',
  '4week' = '4week',
  'Month' = 'Month',
  'Year' = 'Year'
}

export enum PreferencesEnum {
  NEW_HOME = 'New Home',
  RETIREMENT_HOME = 'Retirement Home',
  SHARED_OWNERSHIP = 'Shared Ownership',
  AUCTION = 'Auction'
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

export interface AssetDocument extends Document {
  asset_id: number;
  name: string;
  area_of_interest: string;
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
  asset_files: any[];
  status_string: StatusString | RentStatusString;
  transaction_type_string: TransactionTypeString;
  master_asset_type_string: MasterAssetTypeSring;
  property_type: PropertyType;
  currency_code: CurrencyCode;
  reserved: boolean;
  master_branch_name: string;
  extra_branch_names: [string];
  walkthrough_url: string;
  videos: [{ name: string; url: string }];
  asset_attribute: any[];
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  budget: {
    min_budget: number;
    max_budget: number;
  };
  parking_spot: string;
  EPC_rating: string;
  location_details: string;
  floor_size: number;
  floor_size_unit: string;
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
  buyers: [object];
  specific_property_features: SpecificPropertyFeatures[];
  property_images: object[];
  credit_score_requirements: CreditScoreRequirement;
  contract_details: ContractDetails[];
  settings: any;
  preferences: string;
  client_id: number;
  solicitor_id: number;
  client?: ContactDocument;
  solicitor?: ContactDocument;
  asset_sale?: {
    asking_price: number;
    minimum_offer: number;
    offer_increment_amount: number;
    date_go_live: Date;
    date_offer_deadline: Date;
    date_exchanged: Date;
    date_completion: Date;
    offers_extension: number;
    contract_deposit_percent: number;
    booking_deposit_amount: number;
    special_conditions: string;
    show_all_offers: boolean;
    show_highest_offer: boolean;
    enable_downward_bidding: boolean;
    downward_bidding_allowed_percentage: number;
  };
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
