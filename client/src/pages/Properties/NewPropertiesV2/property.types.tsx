import { ObjectSchema } from 'yup';
import * as yup from 'yup';
import { flatDetailsBuildPurpose, flatDetailsBuildPurposeType } from '../../SetCriteria/criteria.types';

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
  buildingType: string;
  flatDetails?: {
    propertyPurpose?: flatDetailsBuildPurposeType;
    floor?: number;
    lift?: boolean;
    security?: boolean;
  };
  area: number;
  areaUnit: areaUnitType;
  parkingSpot: string;
  epcRating: string;
  description: string;
  locationDetails: string;
  areaOfInterest: string;
  propertyImages: any[];
};

export const areaUnits = ['sq.m', 'sq.ft'];

export type areaUnitType = (typeof areaUnits)[number];

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
  buildingType: yup.string().required('Building type is required'),
  flatDetails: yup
    .object()
    .shape({
      propertyPurpose: yup.string().oneOf(flatDetailsBuildPurpose).optional(),
      floor: yup.number().optional(),
      lift: yup.boolean().optional(),
      security: yup.boolean().optional()
    })
    .optional(),
  area: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1)
    .required('Area is required'),
  areaUnit: yup.string().oneOf(areaUnits).required(),
  parkingSpot: yup.string().required('Parking spot is required'),
  epcRating: yup.string().required('EPC Rating is required'),
  description: yup.string().required('Description is required'),
  locationDetails: yup.string().required('Description is required'),
  areaOfInterest: yup.string().required('Location is required'),
  propertyImages: yup.array().required()
});
