import {
  AreaUnit,
  BudgetFor,
  BuildPurpose,
  ContractDetail,
  CreditScore,
  DistanceUnit,
  Furnished,
  OutsideSpace,
  PropertyPreference,
  PropertyType,
  SpecificPropertyFeature,
  Transaction,
  WhenDoYouWantToMove
} from './criteria.contants';

declare type ObjectValues<T> = T[keyof T];

type CriteriaFormType = {
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
  nrOfBathrooms: number;
  specificPropertyFeatures: {
    [key in SpecificPropertyFeatureType]: boolean;
  };
  distanceFromUnderground: DistanceType;
  distanceFromSchools: DistanceType;
  distanceFromHighStreet: DistanceType;
  distanceFromGym: DistanceType;
};

type BudgetForType = ObjectValues<typeof BudgetFor>;

type DistanceUnitType = ObjectValues<typeof DistanceUnit>;

type DistanceType = {
  value?: number;
  unit: DistanceUnitType;
};

type FurnishedType = ObjectValues<typeof Furnished>;

type OutsideSpaceType = ObjectValues<typeof OutsideSpace>;

type SpecificPropertyFeatureType = ObjectValues<typeof SpecificPropertyFeature>;

type PropertyPreferenceType = ObjectValues<typeof PropertyPreference>;

type TransactionType = ObjectValues<typeof Transaction>;

type ContractDetailType = ObjectValues<typeof ContractDetail>;

type CreditScoreType = ObjectValues<typeof CreditScore>;

type WhenDoYouWantToMoveType = ObjectValues<typeof WhenDoYouWantToMove>;

type BuildPurposeType = ObjectValues<typeof BuildPurpose>;

type AreaUnitType = ObjectValues<typeof AreaUnit>;

type PropertyTypeType = ObjectValues<typeof PropertyType>;
