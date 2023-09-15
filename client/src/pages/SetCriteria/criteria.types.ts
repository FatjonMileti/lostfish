import { ObjectSchema } from 'yup';
import * as yup from 'yup';

export type CriteriaFormType = {
  areaOfInterest: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  radius?: number;
  propertyType: {
    Detached: boolean;
    'Semi-Detached': boolean;
    Terraced: boolean;
    Flats: boolean;
    Bungalows: boolean;
    'Farms/Land': boolean;
    'Park homes': boolean;
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

  whenDoYouWantToMove?: whenDoYouWantToMoveType;

  transactionType: transactionType;

  idealBudget: number[];

  depositAmount?: number;

  contractDetails: {
    [key in contractDetailsType]: boolean;
  };

  creditScore: creditScoreSType;
  area: number[];
  areaUnit: areaUnitType;
  nrOfBedrooms: number[];
  nrOfBathrooms: number;
  specificPropertyFeatures: {
    [key in specificPropertyFeaturesType]: boolean;
  };
  distanceFromUnderground: DistanceType;
  distanceFromSchools: DistanceType;
  distanceFromHighStreet: DistanceType;
  distanceFromGym: DistanceType;
};

export const DistanceUnit = {
  Km: 'km',
  M: 'm',
  Ft: 'ft'
} as const;

export type DistanceUnitType = ObjectValues<typeof DistanceUnit>;

export type DistanceType = {
  value?: number;
  unit: DistanceUnitType;
};

export const Furnished = {
  FullyFurnished: 'Fully furnished',
  PartiallyFurnished: 'Partially furnished',
  Unfurnished: 'Unfurnished'
} as const;

export type FurnishedType = ObjectValues<typeof Furnished>;

export const OutsideSpace = {
  Garden: 'Garden',
  Balcony: 'Balcony',
  Terrace: 'Terrace'
} as const;

export type OutsideSpaceType = ObjectValues<typeof OutsideSpace>;

const OtherSpecificPropertyFeatures = {
  ParkingSpot: 'Parking spot',
  DoubleGlazing: 'Double glazing',
  AllowsSmoking: 'Allows smoking',
  AllowsPets: 'Allows pets',
  CloseToPublicTransport: 'Close to public transport'
} as const;

export const SpecificPropertyFeatures = {
  ...Furnished,
  ...OutsideSpace,
  ...OtherSpecificPropertyFeatures
} as const;

declare type ObjectValues<T> = T[keyof T];
type specificPropertyFeaturesType = ObjectValues<typeof SpecificPropertyFeatures>;

export const propertyPreferences = ['New home', 'Retirement home', 'Shared ownership', 'Auction'] as const;
export type PropertyPreferenceType = (typeof propertyPreferences)[number];

export const propertyTypes = [
  'Detached',
  'Semi-Detached',
  'Terraced',
  'Flats',
  'Bungalows',
  'Park homes',
  'Farms/Land'
] as const;

export const transactionTypes = ['Rent', 'Sale'] as const;
export type transactionType = (typeof transactionTypes)[number];

export const contractDetailsTypes = ['Guarantor', 'Reviewed Property', 'Energy Certificate'] as const;
export type contractDetailsType = (typeof contractDetailsTypes)[number];

export const creditScoreSTypes = ['Excellent', 'Good', 'Fair'] as const;
export type creditScoreSType = (typeof creditScoreSTypes)[number];

export const whenDoYouWantToMoveTypes = [
  'Today',
  'This week',
  'As soon as possible',
  'This month',
  'I’m not in a rush',
  'I want to take my time'
] as const;

export type whenDoYouWantToMoveType = (typeof whenDoYouWantToMoveTypes)[number];

export const BuildPurpose = {
  PurposeBuilt: 'Purpose built',
  Conversion: 'Conversion'
} as const;

export type BuildPurposeType = ObjectValues<typeof BuildPurpose>;

export const areaUnits = ['sq.m', 'sq.ft'];

export type areaUnitType = (typeof areaUnits)[number];

export const criteriaFormSchema: ObjectSchema<CriteriaFormType> = yup.object().shape({
  areaOfInterest: yup.string().required(),
  location: yup.object().shape({
    latitude: yup.number().optional(),
    longitude: yup.number().optional()
  }),
  radius: yup.number().optional(),
  propertyType: yup.object().shape({
    Detached: yup.boolean().required(),
    'Semi-Detached': yup.boolean().required(),
    Terraced: yup.boolean().required(),
    Flats: yup.boolean().required(),
    Bungalows: yup.boolean().required(),
    'Farms/Land': yup.boolean().required(),
    'Park homes': yup.boolean().required()
  }),
  flatDetails: yup
    .object()
    .shape({
      propertyPurpose: yup
        .string()
        .transform((value) => value || undefined)
        .oneOf(Object.values(BuildPurpose)),
      floor: yup.number().optional(),
      lift: yup.boolean().optional(),
      security: yup.boolean().optional()
    })
    .optional(),
  propertyClass: yup.object().shape({
    'New home': yup.boolean().required(),
    'Retirement home': yup.boolean().required(),
    'Shared ownership': yup.boolean().required(),
    Auction: yup.boolean().required()
  }),
  propertyFeatures: yup.object().shape({
    'Parks nearby': yup.boolean().required(),
    'Public transport nearby': yup.boolean().required(),
    'Shopping centers nearby': yup.boolean().required()
  }),
  whenDoYouWantToMove: yup.string().oneOf(whenDoYouWantToMoveTypes).optional(),
  transactionType: yup.string().oneOf(transactionTypes).required(),
  idealBudget: yup.array().required(),
  depositAmount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .optional(),
  contractDetails: yup.object().shape({
    Guarantor: yup.boolean().required(),
    'Reviewed Property': yup.boolean().required(),
    'Energy Certificate': yup.boolean().required()
  }),
  creditScore: yup.string().oneOf(creditScoreSTypes).required(),
  area: yup.array().required(),
  areaUnit: yup.string().oneOf(areaUnits).required(),
  nrOfBedrooms: yup.array().required(),
  nrOfBathrooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bathroom is required'),
  specificPropertyFeatures: yup.object().shape({
    [SpecificPropertyFeatures.ParkingSpot]: yup.boolean().required(),
    [SpecificPropertyFeatures.Garden]: yup.boolean().required(),
    [SpecificPropertyFeatures.Balcony]: yup.boolean().required(),
    [SpecificPropertyFeatures.Terrace]: yup.boolean().required(),
    [SpecificPropertyFeatures.FullyFurnished]: yup.boolean().required(),
    [SpecificPropertyFeatures.PartiallyFurnished]: yup.boolean().required(),
    [SpecificPropertyFeatures.Unfurnished]: yup.boolean().required(),
    [SpecificPropertyFeatures.DoubleGlazing]: yup.boolean().required(),
    [SpecificPropertyFeatures.AllowsSmoking]: yup.boolean().required(),
    [SpecificPropertyFeatures.AllowsPets]: yup.boolean().required(),
    [SpecificPropertyFeatures.CloseToPublicTransport]: yup.boolean().required()
  }),
  distanceFromUnderground: yup.object().shape({
    value: yup.number().positive(),
    unit: yup.string().oneOf(Object.values(DistanceUnit)).required()
  }),
  distanceFromSchools: yup.object().shape({
    value: yup.number().positive(),
    unit: yup.string().oneOf(Object.values(DistanceUnit)).required()
  }),
  distanceFromHighStreet: yup.object().shape({
    value: yup.number().positive(),
    unit: yup.string().oneOf(Object.values(DistanceUnit)).required()
  }),
  distanceFromGym: yup.object().shape({
    value: yup.number().positive(),
    unit: yup.string().oneOf(Object.values(DistanceUnit)).required()
  })
});
