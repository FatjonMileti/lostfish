import {
  BudgetFor,
  Condition,
  ContractDetail,
  CreditScore,
  DistanceUnit,
  HomeStyle,
  PreferredFloor,
  PropertyPreference,
  PropertyType,
  SpecificPropertyFeature,
  Transaction,
  WhenDoYouWantToMove
} from './criteria.contants';
import { AreaUnitType, BuildPurposeType, ParkingType } from '../Properties/NewProperties/property.types';

declare type ObjectValues<T> = T[keyof T];

export type CriteriaFormType = {
  areaOfInterest: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  radius?: number;
  propertyType: {
    [key in PropertyTypeType]: boolean;
  };
  flatDetails?: {
    propertyPurpose?: BuildPurposeType;
    floor?: number;
    lift?: boolean;
    security?: boolean;
    parkingSpace?: boolean;
    gymSpa?: boolean;
    preferredSize?: {
      size?: number[];
      unit?: AreaUnitType;
    };
    nrOfBedrooms: number[];
    nrOfBathrooms: number[];
    condition?: ConditionType;
    preferredFloor?: PreferredFloorType;
  };
  houseDetails?: {
    homeStyle?: HomeStyleType;
    preferredSize?: {
      size?: number[];
      unit?: AreaUnitType;
    };
    garden?: {
      size?: number[];
      unit?: AreaUnitType;
    };
    parking?: ParkingType;
    storeys?: number[];
    nrOfBedrooms: number[];
    nrOfBathrooms: number[];
    condition?: ConditionType;
  };
  propertyClass: {
    'New home': boolean;
    'Retirement home': boolean;
    'Shared ownership': boolean;
    Auction: boolean;
  };
  propertyFeatures: {
    'Parks nearby': boolean;
    'Public transport nearby': boolean;
    'Shopping centers nearby': boolean;
  };
  whenDoYouWantToMove?: WhenDoYouWantToMoveType;
  transactionType: TransactionType;
  idealBudget: number[];
  budgetFor: BudgetForType;
  depositAmount?: number;
  contractDetails: {
    [key in ContractDetailType]: boolean;
  };
  creditScore: CreditScoreType;
  area: number[];
  areaUnit: AreaUnitType;
  nrOfBedrooms: number[];
  nrOfBathrooms: number[];
  specificPropertyFeatures: {
    [key in SpecificPropertyFeatureType]: boolean;
  };
  parkingType: {
    [key in ParkingType]?: boolean;
  };
  distanceFromUnderground: DistanceType;
  distanceFromSchools: DistanceType;
  distanceFromHighStreet: DistanceType;
  distanceFromGym: DistanceType;
};

export type DistanceUnitType = ObjectValues<typeof DistanceUnit>;

type DistanceType = {
  value?: number;
  unit: DistanceUnitType;
};

type SpecificPropertyFeatureType = ObjectValues<typeof SpecificPropertyFeature>;

export type PropertyPreferenceType = ObjectValues<typeof PropertyPreference>;
export type TransactionType = ObjectValues<typeof Transaction>;

type ContractDetailType = ObjectValues<typeof ContractDetail>;

type CreditScoreType = ObjectValues<typeof CreditScore>;

type WhenDoYouWantToMoveType = ObjectValues<typeof WhenDoYouWantToMove>;

type PropertyTypeType = ObjectValues<typeof PropertyType>;

export type BudgetForType = ObjectValues<typeof BudgetFor>;

export type HomeStyleType = ObjectValues<typeof HomeStyle>;

export type ConditionType = ObjectValues<typeof Condition>;

export type PreferredFloorType = ObjectValues<typeof PreferredFloor>;
