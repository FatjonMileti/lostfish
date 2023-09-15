import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { CriteriaFormType } from './criteria.types';

export const BudgetFor = {
  Month: 'Month',
  Week: 'Week'
} as const;

export const DistanceUnit = {
  Km: 'km',
  M: 'm',
  Ft: 'ft'
} as const;
export const Furnished = {
  FullyFurnished: 'Fully furnished',
  PartiallyFurnished: 'Partially furnished',
  Unfurnished: 'Unfurnished'
} as const;
export const OutsideSpace = {
  Garden: 'Garden',
  Balcony: 'Balcony',
  Terrace: 'Terrace'
} as const;

const OtherSpecificPropertyFeature = {
  ParkingSpot: 'Parking spot',
  DoubleGlazing: 'Double glazing',
  AllowsSmoking: 'Allows smoking',
  AllowsPets: 'Allows pets',
  CloseToPublicTransport: 'Close to public transport'
} as const;

export const SpecificPropertyFeature = {
  ...Furnished,
  ...OutsideSpace,
  ...OtherSpecificPropertyFeature
} as const;

export const PropertyPreference = {
  NewHome: 'New home',
  RetirementHome: 'Retirement home',
  SharedOwnership: 'Shared ownership',
  Auction: 'Auction'
} as const;

export const PropertyType = {
  Detached: 'Detached',
  SemiDetached: 'Semi-Detached',
  Terraced: 'Terraced',
  Flats: 'Flats',
  Bungalows: 'Bungalows',
  ParkHomes: 'Park homes',
  FarmsLand: 'Farms/Land'
} as const;

export const Transaction = {
  Rent: 'Rent',
  Sale: 'Sale'
} as const;

export const ContractDetail = {
  Guarantor: 'Guarantor',
  ReviewedProperty: 'Reviewed Property',
  EnergyCertificate: 'Energy Certificate'
} as const;

export const CreditScore = {
  Excellent: 'Excellent',
  Good: 'Good',
  Fair: 'Fair'
} as const;

export const WhenDoYouWantToMove = {
  Today: 'Today',
  ThisWeek: 'This week',
  AsSoonAsPossible: 'As soon as possible',
  ThisMonth: 'This month',
  ImNotInARush: 'I’m not in a rush',
  IWantToTakeMyTime: 'I want to take my time'
} as const;

export const BuildPurpose = {
  PurposeBuilt: 'Purpose built',
  Conversion: 'Conversion'
} as const;

export const AreaUnit = {
  SquareMeter: 'sq.m',
  SquareFoot: 'sq.ft'
} as const;

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
  whenDoYouWantToMove: yup.string().oneOf(Object.values(WhenDoYouWantToMove)).optional(),
  transactionType: yup.string().oneOf(Object.values(Transaction)).required(),
  idealBudget: yup.array().required(),
  budgetFor: yup.string().oneOf(Object.values(BudgetFor)).required(),
  depositAmount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .optional(),
  contractDetails: yup.object().shape({
    Guarantor: yup.boolean().required(),
    'Reviewed Property': yup.boolean().required(),
    'Energy Certificate': yup.boolean().required()
  }),
  creditScore: yup.string().oneOf(Object.values(CreditScore)).required(),
  area: yup.array().required(),
  areaUnit: yup.string().oneOf(Object.values(AreaUnit)).required(),
  nrOfBedrooms: yup.array().required(),
  nrOfBathrooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bathroom is required'),
  specificPropertyFeatures: yup.object().shape({
    [SpecificPropertyFeature.ParkingSpot]: yup.boolean().required(),
    [SpecificPropertyFeature.Garden]: yup.boolean().required(),
    [SpecificPropertyFeature.Balcony]: yup.boolean().required(),
    [SpecificPropertyFeature.Terrace]: yup.boolean().required(),
    [SpecificPropertyFeature.FullyFurnished]: yup.boolean().required(),
    [SpecificPropertyFeature.PartiallyFurnished]: yup.boolean().required(),
    [SpecificPropertyFeature.Unfurnished]: yup.boolean().required(),
    [SpecificPropertyFeature.DoubleGlazing]: yup.boolean().required(),
    [SpecificPropertyFeature.AllowsSmoking]: yup.boolean().required(),
    [SpecificPropertyFeature.AllowsPets]: yup.boolean().required(),
    [SpecificPropertyFeature.CloseToPublicTransport]: yup.boolean().required()
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
