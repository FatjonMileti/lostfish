import { ObjectSchema } from 'yup';
import * as yup from 'yup';
import { BuildPurposeType, FurnishedType, OutsideSpaceType } from '../../SetCriteria/criteria.types';
import { BuildPurpose, Furnished, OutsideSpace } from '../../SetCriteria/criteria.contants';

export type PropertyFormType = {
  title: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  minBudget: number;
  maxBudget: number;
  bedrooms: number;
  bathrooms: number;
  buildingType: BuildingType;
  flatDetails?: {
    propertyPurpose?: BuildPurposeType;
    floor?: number;
    lift?: boolean;
    security?: boolean;
  };
  furniture?: FurnishedType;
  outsideSpace: {
    [key in OutsideSpaceType]?: boolean;
  };
  area: number;
  areaUnit: areaUnitType;
  parkingSpot: string;
  parkingType?: ParkingType;
  epcRating: string;
  description: string;
  locationDetails: string;
  areaOfInterest: string;
  propertyImages: any[];
};

declare type ObjectValues<T> = T[keyof T];

export const Parking = {
  Garage: 'Garage',
  OffStreet: 'Off street',
  OnStreet: 'On street'
} as const;

export type ParkingType = ObjectValues<typeof Parking>;

export const areaUnits: string[] = ['sq.m', 'sq.ft'];

export type areaUnitType = (typeof areaUnits)[number];
export const Building = {
  Detached: 'Detached',
  SemiDetached: 'Semi-Detached',
  Terraced: 'Terraced',
  Flats: 'Flats',
  Bungalows: 'Bungalows',
  FarmsLand: 'Farms/Land'
} as const;

export type BuildingType = ObjectValues<typeof Building>;

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
  areaUnit: yup.string().oneOf(areaUnits).required(),
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
