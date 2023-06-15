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
  'CAN' = 'CAN'
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

export interface IOffer {
  amount: number;
  asset_id: string;
  client_id: string;
  user_id: string;
  status: OfferStatus;
  created_at: Date;
}

export enum OfferStatus {
  Unknown = 'Unknown',
  Confirmed = 'Confirmed',
  ClientWithdrawn = 'Client Withdrawn',
  AgentWithdrawn = 'Agent Withdrawn',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending'
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
  Rent = 'Rent',
  NewHomes = 'New Homes'
}

export enum MasterAssetTypeSring {
  Unknown = 'Unknown',
  Residential = 'Residential',
  Commercial = 'Commercial',
  Marine = 'Marine'
}

export enum AssetTypeString {
  'Unknown' = 'Unknown',
  'Apartment' = 'Apartment',
  'StudioApartment' = 'Studio Apartment',
  'DetachedHouse' = 'Detached House',
  'SemiDetachedHouse' = 'Semi Detached House',
  'MidTerraceHouse' = 'Mid Terrace House',
  'EndTerraceHouse' = 'End of Terrace House',
  'DuplexApartment' = 'Duplex Apartment',
  'Mixed' = 'Mixed',
  'Land' = 'Land',
  'Industrial' = 'Industrial',
  'Retail' = 'Retail',
  'Office' = 'Office',
  'PublicHouse' = 'Public House',
  'Hotel' = 'Hotel',
  'MixedUse' = 'Mixed use',
  'Commercial Land' = 'Commercial Land',
  'MultiFamily' = 'Multi Family',
  'MedicalFacility' = 'Medical Facility'
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

export enum AssetAtribute {
  'Text' = 'Text',
  'Number' = 'Number',
  'TextArea' = 'TextArea',
  'Select' = 'Select',
  'Range' = 'Range',
  'DataList' = 'DataList',
  'AgentDoc' = 'Agent Doc'
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

export enum TabName {
  'Overview',
  'General',
  'Details',
  'Sale',
  'Auction',
  'Client',
  'Applicants',
  'Viewing',
  'Vault',
  'External',
  'Activity',
  'Documents',
  'Advanced',
  'Payments'
}

export enum PreferencesEnum {
  NEW_HOME = 'New Home',
  RETIREMENT_HOME = 'Retirement Home',
  SHARED_OWNERSHIP = 'Shared Ownership',
  AUCTION = 'Auction'
}

export interface AssetDocument extends Document {
  asset_id: number;
  name: string;
  area_of_interest: string;
  radius: string;
  description: string;
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
  asset_files: [any];
  status_string: StatusString | RentStatusString;
  transaction_type_string: TransactionTypeString;
  master_asset_type_string: MasterAssetTypeSring;
  asset_type_string: AssetTypeString;
  property_type: AssetTypeString;
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
  floor_size: number;
  floor_size_unit: string;
  property_features: string[];
  property_preference: string;
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
  asset_rent?: {
    rental_amount: number;
    rental_frequency: RentalFrequency;
    deposit_amount: number;
    interest_by: Date;
    available_from: Date;
  };
  asset_auction: {
    guide_price: number;
    reserve_price: number;
    starting_bid: number;
    bidding_increments: number;
    start_time: Date;
    end_time: Date;
    bidding_extension: number;
    deposit_due_date: Date;
    completion_date: Date;
  };
  client_id: number;
  client?: ContactDocument;
  solicitor_id: number;
  solicitor?: ContactDocument;
  statistics: any;
  permission: {
    administrator_names: [string];
    display_administrator_names: [string];
    branch_administrator_names: [string];
    access: Access;
    tabs: [
      {
        name: TabName;
        roles: [string];
      }
    ];
  };
  offers: IOffer[];
  buyers: [object];
  specific_property_features: string[];
  property_images: [object];
  settings: any;
  preferences: string;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}
