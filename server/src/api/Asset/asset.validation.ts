import * as joi from 'joi';

export const createAssetSchemaValidation = joi.object({
  name: joi.string(),
  area_of_interest: joi.string(),
  description: joi.string().allow(''),
  asset_address: joi.object({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required()
  }),
  status_string: joi.string().required(),
  transaction_type_string: joi.string().required(),
  property_type: joi.string().required(),
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
  property_features: joi.array().items(joi.string()),
  property_preference: joi.string(),
  specific_property_features: joi.array().items(joi.string()),
  property_images: joi.array()
});
