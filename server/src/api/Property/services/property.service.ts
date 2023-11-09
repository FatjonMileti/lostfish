import PropertyModel from '../schemas/property.schema';
import { CurrencyCode, FloorSizeUnit, MasterAssetTypeSring, PropertyDocument } from '../property.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import AssetInvitation, { InvitationDocument } from '../schemas/asset-invitation.schema';
import sendInvitationTemplate from '../../../utils/templates/sendInvitationTemplate';
import { Types } from 'mongoose';
import {
  generateLinksForImages,
  generateLinksForOneAsset,
  getPropertyScore,
  handlePropertyImages
} from '../helpers';
import MailService from '../../../utils/email';
import googleMapService from '../../../external-services/google-map.service';
import { Role } from '../../User/user.interface';
import { AssetLog, LogAction } from '../../../data/logs';
import { faker } from '@faker-js/faker';
import MatchSchema from '../../Match/match.schema';
import { FileService } from '../../File/file.interface';
import propertyDetailService from './property-detail.service';
import { suggestionService } from '../../index';
import PropertyViewSchema from '../schemas/property-view.schema';
import { getPipelineBySort } from '../pipelines/PropertyAggregation';
import { LatLng } from '@googlemaps/google-maps-services-js';
import userService from '../../User/user.service';

const mailService = MailService.getInstance();

const findAll = async (req: Request, res: Response) => {
  const { status } = req.query;

  const query: {
    created_by?: any;
    status_string?: any;
  } = {};

  if ([Role.Client, Role.Landlord].includes(res.locals.role)) {
    query.created_by = res.locals.user_id;
  }

  if (status) {
    let filteredStatus: string[] = [];
    if (status === 'published') {
      filteredStatus = ['Live'];
    }
    if (status === 'draft') {
      filteredStatus = ['Draft'];
    }
    if (status === 'rented') {
      filteredStatus = ['Completed'];
    }

    if (filteredStatus.length > 0) query.status_string = { $in: filteredStatus };
  }

  const count = await PropertyModel.countDocuments({ created_by: res.locals.user_id });

  try {
    const response = await PropertyModel.paginate(query, {
      ...res.locals.paging_options,
      populate: [
        {
          path: 'created_by',
          select: ['email', 'username', 'first_name', 'last_name']
        },
        {
          path: 'edited_by',
          select: ['email', 'username', 'first_name', 'last_name']
        }
      ]
    });

    response.totalDocsUnfiltered = count;
    response.docs = generateLinksForImages(response.docs);
    await AssetLog.create({ user: res.locals.user_id, action: LogAction.Read, info: query });
    return res.status(httpStatus.OK).send(response);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send(error?.response?.data);
  }
};

const createAsset = async (req: Request, res: Response): Promise<any> => {
  const data: PropertyDocument = req.body;
  data.created_by = res.locals.user_id;
  data.currency_code = CurrencyCode.GBP;
  data.master_asset_type_string = MasterAssetTypeSring.Residential;

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
    const asset: PropertyDocument = new PropertyModel({ ...data });
    const property = await asset.save();

    const propertyScore = getPropertyScore(property);

    await propertyDetailService.createPropertyDetail(property._id, propertyScore);
    await AssetLog.create({ user: res.locals.user_id, action: LogAction.Create, info: data });
    res.status(httpStatus.CREATED).send(asset.toObject());
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'property_not_saved' });
  }
};

const updateAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await userService.findOne({ _id: res.locals.user_id });

    if (!user) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not found' });
    }

    const data: PropertyDocument = req.body;
    const id = req.params.id;
    const asset = await findById(id);

    if (data.hasOwnProperty('name')) {
      asset.name = data.name;
    }

    if (data.hasOwnProperty('flat_details')) {
      asset.flat_details = data.flat_details;
    }

    if (data.hasOwnProperty('house_details')) {
      asset.house_details = data.house_details;
    }

    if (data.hasOwnProperty('parking_details')) {
      asset.parking_details = data.parking_details;
    }

    if (data.hasOwnProperty('floor_size_unit')) {
      asset.floor_size_unit = data.floor_size_unit;
    }

    if (data.hasOwnProperty('area_of_interest')) {
      asset.area_of_interest = data.area_of_interest;
    }

    if (data.hasOwnProperty('radius')) {
      asset.radius = data.radius;
    }

    if (data.hasOwnProperty('description')) {
      asset.description = data.description;
    }

    if (data.asset_address?.latitude && data.asset_address?.longitude) {
      // Location has changed

      if (
        asset.asset_address?.latitude !== data.asset_address?.latitude ||
        asset.asset_address?.longitude !== data.asset_address?.longitude
      ) {
        const origin: LatLng = {
          lat: data.asset_address?.latitude,
          lng: data.asset_address?.longitude
        };

        // Underground
        const distanceFromUnderground = await googleMapService.getDistanceFrom({
          origin,
          type: 'subway_station'
        });
        if (distanceFromUnderground) {
          asset.distance_from_underground = {
            value: distanceFromUnderground.value / 1000
          };
        } else {
          asset.distance_from_underground = {};
        }

        // School
        const distanceFromSchool = await googleMapService.getDistanceFrom({
          origin,
          type: 'school'
        });
        if (distanceFromSchool) {
          asset.distance_from_schools = {
            value: distanceFromSchool.value / 1000
          };
        } else {
          asset.distance_from_schools = {};
        }

        // Gym
        const distanceFromGym = await googleMapService.getDistanceFrom({
          origin,
          type: 'gym'
        });
        if (distanceFromGym) {
          asset.distance_from_gym = {
            value: distanceFromGym.value / 1000
          };
        } else {
          asset.distance_from_gym = {};
        }

        // High street
        const distanceFromHighStreet = await googleMapService.getDistanceFrom({
          origin,
          type: 'store'
        });
        if (distanceFromHighStreet) {
          asset.distance_from_high_street = {
            value: distanceFromHighStreet.value / 1000
          };
        } else {
          asset.distance_from_high_street = {};
        }
      }
    }

    if (data.hasOwnProperty('asset_address')) {
      asset.asset_address = data.asset_address;
    }

    if (data.hasOwnProperty('title')) {
      asset.title = data.title;
    }

    if (data.hasOwnProperty('budget')) {
      asset.budget = data.budget;
    }

    if (data.hasOwnProperty('parking_spot')) {
      asset.parking_spot = data.parking_spot;
    }

    if (data.hasOwnProperty('epc_rating')) {
      asset.epc_rating = data.epc_rating;
    }

    if (data.hasOwnProperty('condition')) {
      asset.condition = data.condition;
    }

    if (data.hasOwnProperty('status_string')) {
      asset.status_string = data.status_string;
    }

    if (req.body.hasOwnProperty('transaction_type_string')) {
      asset.transaction_type_string = req.body.transaction_type_string;
    }

    if (req.body.hasOwnProperty('property_type')) {
      asset.property_type = data.property_type;
    }

    if (data.hasOwnProperty('asset_rent')) {
      asset.asset_rent = data.asset_rent;
    }

    if (data.hasOwnProperty('floor_size')) {
      asset.floor_size = data.floor_size;
    }

    if (data.hasOwnProperty('room_details')) {
      asset.room_details = data.room_details;
    }

    if (data.hasOwnProperty('property_features')) {
      asset.property_features = data.property_features;
    }

    if (data.hasOwnProperty('property_preference')) {
      asset.property_preference = data.property_preference;
    }

    if (data.hasOwnProperty('specific_property_features')) {
      asset.specific_property_features = data.specific_property_features;
    }

    if (data.hasOwnProperty('credit_score_requirements')) {
      asset.credit_score_requirements = data.credit_score_requirements;
    }

    if (data.hasOwnProperty('contract_details')) {
      asset.contract_details = data.contract_details;
    }

    if (req.body.hasOwnProperty('property_images')) {
      asset.property_images = handlePropertyImages(asset.property_images, data.property_images);
    }

    const propertyScore = getPropertyScore(asset);

    await propertyDetailService.findAndUpdateByPropertyId(asset._id, { property_score: propertyScore });

    await asset.save();
    await user.setTrustScore();
    await user.save();
    await AssetLog.create({ user: res.locals.user_id, action: LogAction.Update, ref: id, info: data });
    res.status(httpStatus.OK).send(asset);
  } catch (error: any) {
    throw createError(400, error);
  }
};

const getById = async (req: Request, res: Response): Promise<any | null> => {
  const id = req.params.id;

  const asset: PropertyDocument | null = await PropertyModel.findOne({ _id: id });

  if (!asset) {
    throw createError(404, 'The item does not exist');
  }

  asset.property_images = generateLinksForOneAsset(asset.property_images);
  await AssetLog.create({
    user: res.locals.user_id,
    action: LogAction.Read,
    ref: id,
    info: asset.toObject()
  });
  res.status(httpStatus.OK).send(asset);
};

const findById = async (id: string): Promise<any | null> => {
  const asset: PropertyDocument | null = await PropertyModel.findOne({ _id: id });

  if (!asset) {
    throw createError(404, 'The item does not exist');
  }
  return asset;
};

const findPropertyById = async (id: string): Promise<any | null> => {
  return PropertyModel.findOne({ _id: id }).lean();
};

const findLastAddedPropertyWithDetails = async (req: Request, res: Response) => {
  const lastAddedProperty = await PropertyModel.findOne(
    { status_string: 'Live', created_by: <string>res.locals.user_id },
    {},
    { sort: { created_at: -1 } }
  );

  if (!lastAddedProperty) {
    throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
  }

  const propertyDetails: any = await propertyDetailService.findPropertyByPropertyId(
    <string>lastAddedProperty._id
  );

  const matches = await suggestionService.getTenantsByUser(<string>res.locals.user_id);

  propertyDetails.tenants = matches.response.map((item: any) => item.criteria.created_by);

  propertyDetails.my_chosen_matches = await MatchSchema.count({
    created_by: <string>res.locals.user_id,
    property: <string>lastAddedProperty._id
  });

  res.send({ property: lastAddedProperty, details: propertyDetails });
};

const deleteAsset = async (req: Request, res: Response) => {
  const id = req.params.id;
  await PropertyModel.findByIdAndDelete(id);
  await AssetLog.create({ user: res.locals.user_id, action: LogAction.Delete, ref: id });
  res.status(httpStatus.NO_CONTENT).send();
};

const sendAssetInvitation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const invitationDocument = req.body as InvitationDocument;
  const asset = await findById(id);

  const invitationTemplate = sendInvitationTemplate({
    link: `${process.env.FRONTEND_URL}/properties/${asset._id}/view`,
    assetName: asset.name,
    clientName: invitationDocument.first_name
  });

  // @ts-ignore
  invitationDocument.created_by = new Types.ObjectId(res.locals.user_id);
  invitationDocument.asset = asset._id;

  await AssetInvitation.create({ ...invitationDocument });

  // @ts-ignore
  await mailService.sendMail({
    to: req.body.email,
    subject: 'Invitation to the property',
    html: invitationTemplate.html
  });

  res.status(httpStatus.OK).send({ message: 'invitation_send' });
};

const findPublishedProperties = async (req: Request, res: Response) => {
  const query: any = {
    status_string: { $in: ['Let', 'Live', 'For Let', 'For Sale'] }
  };

  try {
    const response: any = await PropertyModel.paginate(query, {
      ...res.locals.paging_options,
      populate: [
        {
          path: 'created_by',
          select: ['email', 'username', 'first_name', 'last_name', 'avatar', 'deleted_at']
        },
        {
          path: 'edited_by',
          select: ['email', 'username', 'first_name', 'last_name', 'avatar']
        }
      ]
    }).then((result) => {
      result.docs = result.docs.filter((asset: any) => !asset.created_by.deleted_at);
      if (result.docs.length === 0) {
        result.totalDocs = 0;
      }
      return result;
    });

    const matches = await MatchSchema.find({ created_by: res.locals.user_id }).lean();
    response.docs = generateLinksForImages(response.docs);
    response.docs = response.docs.map((item: any, index: number) => {
      const matchProperty = matches.find((match: any) => match.property.toString() === item._id.toString());
      return {
        sugestion_id: index,
        property: {
          ...item.toObject()
        },
        chosen: matchProperty?.chosen ?? false,
        starred: matchProperty?.starred ?? false,
        matchId: matchProperty?._id ?? undefined,
        percentage: faker.number.int({ min: 30, max: 100 })
      };
    });

    return res.status(httpStatus.OK).send(response);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send(error?.response?.data);
  }
};

const findPublishedPropertiesExample = async ({
  userId,
  propertyId
}: {
  userId?: string;
  propertyId?: string;
}): Promise<PropertyDocument[]> => {
  const query: any = {
    status_string: { $in: ['Let', 'Live', 'For Let', 'For Sale'] }
  };

  if (userId) {
    query.created_by = { $eq: userId };
  }

  if (propertyId) {
    query._id = { $eq: propertyId };
  }

  try {
    return await PropertyModel.find(query).lean();
  } catch (error: any) {
    return [];
  }
};

const uploadAssetFiles = async (req: Request, res: Response, fileService: FileService) => {
  const files = req.files as any[];
  const savedFiles = await fileService.uploadFiles(files);
  return res.send(savedFiles);
};

const getPropertyViewers = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { page, limit }: PaginationOptions = res.locals.paging_options || {};
  const sort: any = { created_at: -1 };
  const skip = page ? (page - 1) * 10 : 0;
  const views = await PropertyViewSchema.aggregate([
    {
      $match: {
        property: { $eq: new Types.ObjectId(id) }
      }
    },
    ...getPipelineBySort('getAll')(page, skip, limit, sort)
  ]);

  const response = views.length > 0 ? views[0] : DefaultResponse;
  for (const item of response.docs) {
    item.user.match_similarity = suggestionService.calculateSimilarity(item.user.criteria, item.property);
  }
  if (response.docs.length > 0) {
    response.docs = response.docs.map((item: any) => item.user);
  }

  res.send(response);
};

export default {
  findAll,
  getById,
  createAsset,
  deleteAsset,
  updateAsset,
  findById,
  sendAssetInvitation,
  findPublishedProperties,
  findPublishedPropertiesExample,
  findPropertyById,
  uploadAssetFiles,
  findLastAddedPropertyWithDetails,
  getPropertyViewers
};

type PaginationOptions = {
  sort?: object;
  page?: number;
  limit?: number;
};

const DefaultResponse: any = {
  docs: [],
  limit: 10,
  page: 1,
  totalDocs: 0,
  totalPages: 1
};
