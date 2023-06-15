import * as joi from 'joi';

export const createAssetSchemaValidation = joi.object({
  name: joi.string().required(),
  description: joi.string().allow(''),
  asset_address: joi.object({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    street_number: joi.string().allow(''),
    route: joi.string().allow(''),
    neighbourhood: joi.string().allow(''),
    postal_town: joi.string().allow(''),
    postal_code: joi.string().required(),
    administrative_area_level_1: joi.string().allow(''),
    country_code: joi.string().required(),
    text: joi.string()
  }),
  status_string: joi.string().required(),
  transaction_type_string: joi.string().required(),
  master_asset_type_string: joi.string().required(),
  asset_type_string: joi.string().required(),
  asset_rent: joi.object({
    rental_amount: joi.number().allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().required(),
  floor_size_unit: joi.string().required(),
  room_details: joi.object({
    number_of_bathrooms: joi.number().required(),
    number_of_bedrooms: joi.number().required()
  }),
  property_features: joi.array().items(joi.string()),
  property_preference: joi.string(),
  specific_property_features: joi.array().items(joi.string()),
  property_images: joi.array()
});
