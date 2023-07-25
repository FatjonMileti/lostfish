import AssetModel from '../schemas/asset.schema';
import { AssetDocument, CurrencyCode, MasterAssetTypeSring } from '../asset.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import AssetInvitation, { InvitationDocument } from '../schemas/asset-invitation.schema';
import sendInvitationTemplate from '../../../utils/templates/sendInvitationTemplate';
import { Types } from 'mongoose';
import { generateLinksForImages, generateLinksForOneAsset } from '../helpers';
import MailService from '../../../utils/email';
import googleMapService from '../../../external-services/google-map.service';
import fileService from '../../../external-services/file.service';

const mailService = MailService.getInstance();

const findAll = async (req: Request, res: Response) => {
  const { status } = req.query;

  const query: {
    created_by: any;
    status_string?: any;
  } = {
    created_by: res.locals.user_id
  };

  if (status) {
    let filteredStatus: string[] = [];
    if (status === 'published') {
      filteredStatus = ['Let', 'Live', 'For Let', 'For Sale', 'Let Agreed', 'Sale Agreed'];
    }
    if (status === 'draft') {
      filteredStatus = ['Draft'];
    }

    if (filteredStatus.length > 0) query.status_string = { $in: filteredStatus };
  }

  const count = await AssetModel.countDocuments();

  try {
    const response = await AssetModel.paginate(query, {
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

    return res.status(httpStatus.OK).send(response);
  } catch (error: any) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send(error?.response?.data);
  }
};

const createAsset = async (req: Request, res: Response): Promise<any> => {
  const data: AssetDocument = req.body;
  data.created_by = res.locals.user_id;
  data.floor_size_unit = 'Meter Squared';
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
    const asset: AssetDocument = new AssetModel({ ...data });
    await asset.save();

    res.status(httpStatus.CREATED).send(asset.toObject());
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'property_not_saved' });
  }
};

const updateAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const data: AssetDocument = req.body;
    const id = req.params.id;
    const asset = await findById(id);

    if (data.hasOwnProperty('name')) {
      asset.name = data.name;
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

    if (data.hasOwnProperty('asset_address')) {
      asset.asset_address = data.asset_address;
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
      asset.property_images = [...asset.property_images, ...data.property_images];
    }

    await asset.save();

    res.status(httpStatus.OK).send(asset);
  } catch (error: any) {
    throw createError(400, error);
  }
};

const getById = async (req: Request, res: Response): Promise<any | null> => {
  const id = req.params.id;

  const asset: AssetDocument | null = await AssetModel.findOne({ _id: id });

  if (!asset) {
    throw createError(404, 'The item does not exist');
  }

  asset.property_images = generateLinksForOneAsset(asset.property_images);

  res.status(httpStatus.OK).send(asset);
};

const findById = async (id: string): Promise<any | null> => {
  const asset: AssetDocument | null = await AssetModel.findOne({ _id: id });

  if (!asset) {
    throw createError(404, 'The item does not exist');
  }
  return asset;
};

const deleteAsset = async (req: Request, res: Response) => {
  const id = req.params.id;
  await AssetModel.findByIdAndDelete(id);
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

const getAssetImages = async (req: Request, res: Response) => {
  const id = req.params.id;

  const asset = await findById(id);

  try {
    const imageUrls = asset.property_images.map(
      (image: any) => `${req.protocol}://${req.get('host')}/url-to-file/${image.filename}`
    );

    res.json(imageUrls);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

const getSingleImage = async (req: Request, res: Response) => {
  const { id, imageId } = req.params;
  try {
    const asset = await findById(id);
    const { property_images } = asset;

    const getImage = property_images.find((propImage: any) => propImage.filename === imageId);
    if (!getImage) {
      res.status(httpStatus.NOT_FOUND).send({ message: 'not_found' });
    }

    return fileService
      .readFile(imageId)
      .then((response) => {
        res.setHeader('Content-Type', getImage.mimetype || 'application/octet-stream');
        res.send(response);
      })
      .catch((error: any) => {
        res.status(httpStatus.BAD_REQUEST).send(error);
      });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const findPublishedProperties = async (req: Request, res: Response) => {
  const query: any = {
    status_string: { $in: ['Let', 'Live', 'For Let', 'For Sale'] }
  };

  try {
    const response = await AssetModel.paginate(query, {
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

    response.docs = generateLinksForImages(response.docs);

    return res.status(httpStatus.OK).send(response);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send(error?.response?.data);
  }
};

export default {
  findAll,
  getById,
  createAsset,
  deleteAsset,
  updateAsset,
  findById,
  sendAssetInvitation,
  getAssetImages,
  getSingleImage,
  findPublishedProperties
};
