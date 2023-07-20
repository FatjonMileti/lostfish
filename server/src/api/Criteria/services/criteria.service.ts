import CriteriaModel from '../schemas/criteria.schema';
import { CriteriaDocument, LookingForEnum } from '../criteria.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import googleMapService from '../../../external-services/google-map.service';
import { CurrencyCode } from '../../Asset/asset.interface';
import userService from '../../User/user.service';
import { Role } from '../../User/user.interface';

const createCriteria = async (req: Request, res: Response): Promise<any> => {
  const data: CriteriaDocument = req.body;
  data.created_by = res.locals.user_id;
  data.floor_size_unit = 'Meter Squared';
  data.currency_code = CurrencyCode.GBP;
  if (data.area_of_interest) {
    const coordinates = await googleMapService.getCoordinates(data.area_of_interest);
    if (coordinates.geometry) {
      const { lat, lng } = coordinates.geometry.location;
      if (lat && lng) {
        const assetAddress = await googleMapService.getAddress(lat, lng);

        if (assetAddress) {
          data.asset_address = assetAddress;
        }
      }
    }
  }

  try {
    const user = await userService.findOne({ _id: res.locals.user_id });
    if (!user) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not found' });
    }
    if (data.looking_for === LookingForEnum.LOOKING_FOR_PLACE) {
      user.role = Role.Client;
    }
    if (data.looking_for === LookingForEnum.OWN_A_PLACE) {
      user.role = Role.Landlord;
    }
    await user.save();
    const criteria: CriteriaDocument = new CriteriaModel({ ...data });
    await criteria.save();

    res.status(httpStatus.CREATED).send(criteria.toObject());
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'property_not_saved' });
  }
};

const updateCriteria = async (req: Request, res: Response): Promise<any> => {
  try {
    const data: CriteriaDocument = req.body;

    const criteria: CriteriaDocument | null = await CriteriaModel.findOne({ created_by: res.locals.user_id });

    if (!criteria) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'criteria not found' });
    }

    if (data.hasOwnProperty('budget')) {
      criteria.budget = data.budget;
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

    if (req.body.hasOwnProperty('transaction_type_string')) {
      criteria.transaction_type_string = req.body.transaction_type_string;
    }

    if (req.body.hasOwnProperty('property_type')) {
      criteria.property_type = data.property_type;
    }

    if (req.body.hasOwnProperty('deposit_amount')) {
      criteria.deposit_amount = data.deposit_amount;
    }

    if (req.body.hasOwnProperty('contact_details')) {
      criteria.contact_details = data.contact_details;
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

    if (data.hasOwnProperty('property_preferences')) {
      criteria.property_preferences = data.property_preferences;
    }

    if (data.hasOwnProperty('specific_property_features')) {
      criteria.specific_property_features = data.specific_property_features;
    }

    if (data.hasOwnProperty('credit_score_requirements')) {
      criteria.credit_score_requirements = data.credit_score_requirements;
    }

    if (data.hasOwnProperty('looking_for')) {
      criteria.looking_for = data.looking_for;
    }

    if (data.hasOwnProperty('moving_time')) {
      criteria.moving_time = data.moving_time;
    }

    await criteria.save();

    res.status(httpStatus.OK).send(criteria);
  } catch (error: any) {
    throw createError(400, error);
  }
};

const getByUserId = async (req: Request, res: Response): Promise<any | null> => {
  const userId = res.locals.user_id;

  const criteria: CriteriaDocument | null = await CriteriaModel.findOne({ created_by: userId });

  if (!criteria) {
    throw createError(404, 'The item does not exist');
  }

  res.status(httpStatus.OK).send(criteria);
};

const getById = async (req: Request, res: Response): Promise<any | null> => {
  const id = req.params.id;

  const criteria: CriteriaDocument | null = await CriteriaModel.findOne({ _id: id });

  if (!criteria) {
    throw createError(404, 'The item does not exist');
  }

  res.status(httpStatus.OK).send(criteria);
};

const findById = async (id: string): Promise<any | null> => {
  const criteria: CriteriaDocument | null = await CriteriaModel.findOne({ _id: id });

  if (!criteria) {
    throw createError(httpStatus.NOT_FOUND, 'The item does not exist');
  }
  return criteria;
};

const deleteCriteria = async (req: Request, res: Response) => {
  const id = req.params.id;
  await CriteriaModel.findByIdAndDelete(id);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  getById,
  createCriteria,
  deleteCriteria,
  updateCriteria,
  findById,
  getByUserId
};
