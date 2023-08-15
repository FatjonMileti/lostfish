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
  nrOfBedrooms: number[];
  nrOfBathrooms: number;
  specificPropertyFeatures: {
    [key in specificPropertyFeaturesType]: boolean;
  };
};

export const specificPropertyFeaturesTypes = [
  'Parking spot',
  'Garden',
  'Terrace',
  'Fully furnished',
  'Partially furnished',
  'Unfurnished',
  'Double glazing',
  'Allows smoking',
  'Allows pets',
  'Close to public transport'
] as const;

export type specificPropertyFeaturesType = (typeof specificPropertyFeaturesTypes)[number];

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
  nrOfBedrooms: yup.array().required(),
  nrOfBathrooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bathroom is required'),
  specificPropertyFeatures: yup.object().shape({
    'Parking spot': yup.boolean().required(),
    Garden: yup.boolean().required(),
    Terrace: yup.boolean().required(),
    'Fully furnished': yup.boolean().required(),
    'Partially furnished': yup.boolean().required(),
    Unfurnished: yup.boolean().required(),
    'Double glazing': yup.boolean().required(),
    'Allows smoking': yup.boolean().required(),
    'Allows pets': yup.boolean().required(),
    'Close to public transport': yup.boolean().required()
  })
});
