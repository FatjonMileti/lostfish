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
    rental_amount: joi.number().allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().required(),
  room_details: joi.object({
    number_of_bathrooms: joi.number().required(),
    number_of_bedrooms: joi.number().required()
  }),
  budget: joi.object({
    min_budget: joi.number().required(),
    max_budget: joi.number().required(),
  }),
  parking_spot: joi.number(),
  epc_rating: joi.string().required(),
  location_details: joi.string().required(),
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
    rental_amount: joi.number().allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().allow(''),
  room_details: joi.object({
    number_of_bathrooms: joi.number().allow(''),
    number_of_bedrooms: joi.number().allow('')
  }),
  budget: joi.object({
    min_budget: joi.number().allow(''),
    max_budget: joi.number().allow(''),
  }),
  parking_spot: joi.number().allow(''),
  epc_rating: joi.string().allow(''),
  location_details: joi.string().allow(''),
  property_features: joi.array().items(joi.string().allow('')),
  property_preference: joi.string().allow(''),
  specific_property_features: joi.array().items(joi.string()),
  property_images: joi.array(),
  credit_score_requirements: joi.string().allow(''),
  contract_details: joi.array().items(joi.string())
});
