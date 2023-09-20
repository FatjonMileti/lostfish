import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { PropertyFormType } from './property.types';

export const Parking = {
  Garage: 'Garage',
  OffStreet: 'Off street',
  OnStreet: 'On street'
} as const;

export const Building = {
  Detached: 'Detached',
  SemiDetached: 'Semi-Detached',
  Terraced: 'Terraced',
  Flats: 'Flats',
  Bungalows: 'Bungalows',
  FarmsLand: 'Farms/Land'
} as const;
export const BuildPurpose = {
  PurposeBuilt: 'Purpose built',
  Conversion: 'Conversion'
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
export const AreaUnit = {
  SquareMeter: 'sq.m',
  SquareFoot: 'sq.ft'
} as const;
export const propertyFormSchema: ObjectSchema<PropertyFormType> = yup.object().shape({
  title: yup.string().required('Title is required'),
  location: yup.object().shape({
    latitude: yup.number().optional(),
    longitude: yup.number().optional()
  }),
  minBudget: yup
    .number()
    .min(0, 'Must be greater then or equal to 0')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Minimum budget is a required'),
  maxBudget: yup
    .number()
    .min(0, 'Must be greater then or equal to 0')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Maximum budget is a required'),
  bedrooms: yup
    .number()
    .min(0, 'Must be greater then or equal to 0')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bedrooms is required'),
  bathrooms: yup
    .number()
    .min(0, 'Must be greater then or equal to 0')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bathrooms is required'),
  buildingType: yup.string().oneOf(Object.values(Building)).required('Building type is required'),
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
  furniture: yup
    .string()
    .transform((value) => value || undefined)
    .oneOf(Object.values(Furnished)),
  outsideSpace: yup.object().shape({
    [OutsideSpace.Terrace]: yup.boolean().optional(),
    [OutsideSpace.Balcony]: yup.boolean().optional(),
    [OutsideSpace.Garden]: yup.boolean().optional()
  }),
  area: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1)
    .required('Area is required'),
  areaUnit: yup.string().oneOf(Object.values(AreaUnit)).required(),
  parkingSpot: yup.string().required('Parking spot is required'),
  parkingType: yup
    .string()
    .transform((value) => value || undefined)
    .oneOf(Object.values(Parking)),
  epcRating: yup.string().required('EPC Rating is required'),
  description: yup.string().required('Description is required'),
  locationDetails: yup.string().required('Description is required'),
  areaOfInterest: yup.string().required('Location is required'),
  propertyImages: yup.array().required()
});
