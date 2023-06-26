import AssetModel from '../schemas/criteria.schema';
import { CriteriaDocument } from '../criteria.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { getCurrentStatusForPost } from '../helpers';

import googleMapService from '../../../external-services/google-map.service';
import CriteriaSchema from '../schemas/criteria.schema';

const createAsset = async (req: Request, res: Response): Promise<any> => {
  const data: CriteriaDocument = req.body;
  data.created_by = res.locals.user_id;

  if (data.asset_address.longitude && data.asset_address.longitude) {
    const assetAddress = await googleMapService.getAddress(
      data.asset_address.latitude,
      data.asset_address.longitude
    );

    if (assetAddress) {
      data.asset_address = assetAddress;
    }
  }

  try {
    const criteria: CriteriaDocument = new AssetModel({ ...data });
    await criteria.save();

    res.status(httpStatus.CREATED).send(criteria.toObject());
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'property_not_saved' });
  }
};

const updateAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const data: CriteriaDocument = req.body;
    const id = req.params.id;
    const criteria = await findById(id);

    if (data.hasOwnProperty('budget')) {
      criteria.name = data.budget;
    }

    if (data.hasOwnProperty('area_of_interest')) {
      criteria.area_of_interest = data.area_of_interest;
    }

    if (data.hasOwnProperty('radius')) {
      criteria.radius = data.radius;
    }

    if (data.hasOwnProperty('asset_address')) {
      criteria.asset_address = data.asset_address;
    }

    if (data.hasOwnProperty('status_string')) {
      criteria.status_string = getCurrentStatusForPost(req.body.status_string);
    }

    if (req.body.hasOwnProperty('transaction_type_string')) {
      criteria.transaction_type_string = req.body.transaction_type_string;
    }

    if (req.body.hasOwnProperty('property_type')) {
      criteria.property_type = data.property_type;
    }

    if (data.hasOwnProperty('asset_rent')) {
      criteria.asset_rent = data.asset_rent;
    }

    if (data.hasOwnProperty('floor_size')) {
      criteria.floor_size = data.floor_size;
    }

    if (data.hasOwnProperty('room_details')) {
      criteria.room_details = data.room_details;
    }

    if (data.hasOwnProperty('property_features')) {
      criteria.property_features = data.property_features;
    }

    if (data.hasOwnProperty('property_preference')) {
      criteria.property_preference = data.property_preference;
    }

    if (data.hasOwnProperty('specific_property_features')) {
      criteria.specific_property_features = data.specific_property_features;
    }

    if (data.hasOwnProperty('credit_score_requirements')) {
      criteria.credit_score_requirements = data.credit_score_requirements;
    }

    await criteria.save();

    res.status(httpStatus.OK).send(criteria);
  } catch (error: any) {
    throw createError(400, error);
  }
};

const getById = async (req: Request, res: Response): Promise<any | null> => {
  const id = req.params.id;

  const criteria: CriteriaDocument | null = await CriteriaSchema.findOne({ _id: id });

  if (!criteria) {
    throw createError(404, 'The item does not exist');
  }

  res.status(httpStatus.OK).send(criteria);
};

const findById = async (id: string): Promise<any | null> => {
  const criteria: CriteriaDocument | null = await CriteriaSchema.findOne({ _id: id });

  if (!criteria) {
    throw createError(404, 'The item does not exist');
  }
  return criteria;
};

const deleteAsset = async (req: Request, res: Response) => {
  const id = req.params.id;
  await CriteriaSchema.findByIdAndDelete(id);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  getById,
  createAsset,
  deleteAsset,
  updateAsset,
  findById
};
