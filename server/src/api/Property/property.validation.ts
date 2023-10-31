import * as joi from 'joi';

export const createAssetSchemaValidation = joi.object({
  name: joi.string(),
  title: joi.string(),
  area_of_interest: joi.string(),
  radius: joi.string(),
  description: joi.string().allow(''),
  asset_address: joi.object({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required()
  }),
  status_string: joi.string().required(),
  transaction_type_string: joi.string().required(),
  property_type: joi.string().optional(),
  asset_rent: joi.object({
    rental_amount: joi.number().min(0).allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().min(0).allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().required(),
  floor_size_unit: joi.string(),
  room_details: joi.object({
    number_of_bathrooms: joi.number().min(0),
    number_of_bedrooms: joi.number().min(0)
  }),
  budget: joi.object({
    min_budget: joi.number().min(0).required(),
    max_budget: joi.number().min(0).required()
  }),
  flat_details: {
    property_purpose: joi.string(),
    floor: joi.string(),
    lift: joi.boolean(),
    security: joi.boolean(),
    gym_spa: joi.boolean(),
    outside_space: joi.array().items(joi.string())
  },
  house_details: {
    house_type: joi.string().allow('')
  },
  parking_spot: joi.number().min(0),
  parking_details: joi.string(),
  epc_rating: joi.string().required(),
  condition: joi.string().allow(''),
  property_features: joi.array().items(joi.string()),
  property_preference: joi.string(),
  specific_property_features: joi.array().items(joi.string()),
  property_images: joi.array(),
  credit_score_requirements: joi.string(),
  contract_details: joi.array().items(joi.string())
});

export const createAssetSchemaValidationDraft = joi.object({
  name: joi.string().allow(''),
  title: joi.string().allow(''),
  area_of_interest: joi.string().allow(''),
  radius: joi.string().allow(''),
  description: joi.string().allow(''),
  asset_address: joi.object({
    latitude: joi.number().min(-90).max(90).allow(''),
    longitude: joi.number().min(-180).max(180).allow('')
  }),
  status_string: joi.string().allow(''),
  transaction_type_string: joi.string().allow(''),
  property_type: joi.string().allow(''),
  asset_rent: joi.object({
    rental_amount: joi.number().min(0).allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().min(0).allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().allow(''),
  floor_size_unit: joi.string().allow(''),
  room_details: joi.object({
    number_of_bathrooms: joi.number().min(0).allow(''),
    number_of_bedrooms: joi.number().min(0).allow('')
  }),
  budget: joi.object({
    min_budget: joi.number().min(0).allow(''),
    max_budget: joi.number().min(0).allow('')
  }),
  flat_details: {
    property_purpose: joi.string().allow(''),
    floor: joi.string().allow(''),
    lift: joi.boolean().allow(''),
    security: joi.boolean().allow(''),
    gym_spa: joi.boolean().allow(''),
    outside_space: joi.array().items(joi.string())
  },
  house_details: {
    house_type: joi.string().allow('')
  },
  outside_space: joi.array().items(joi.string().allow('')),
  parking_spot: joi.number().min(0).allow(''),
  parking_details: joi.string().allow(''),
  epc_rating: joi.string().allow(''),
  condition: joi.string().allow(''),
  property_features: joi.array().items(joi.string().allow('')),
  property_preference: joi.string().allow(''),
  specific_property_features: joi.array().items(joi.string()),
  property_images: joi.array(),
  credit_score_requirements: joi.string().allow(''),
  contract_details: joi.array().items(joi.string())
});
