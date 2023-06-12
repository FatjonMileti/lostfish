import AssetModel from '../schemas/asset.schema';
import { AssetDocument, IOffer } from '../asset.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import AssetInvitation, { InvitationDocument } from '../schemas/asset-invitation.schema';
import sendInvitationTemplate from '../../../utils/templates/sendInvitationTemplate';
import offrIoService from '../../../external-services/offr-io.service';

import { Types } from 'mongoose';
import { getCurrentStatusForGet, getCurrentStatusForPost } from '../helpers';
import MailService from '../../../utils/email';
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

  try {
    const response = await AssetModel.paginate(query, {
      ...res.locals.paging_options,
      populate: [
        {
          path: 'created_by',
          select: ['email', 'username', 'firstName', 'last_name']
        },
        {
          path: 'edited_by',
          select: ['email', 'username', 'firstName', 'last_name']
        }
      ]
    });

    return res.status(httpStatus.OK).send(response);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send(error?.response?.data);
  }
};

const syncAll = async (req: Request, res: Response) => {
  const response = await offrIoService.getAssets();
  const dataToUpdate = response.map((data: any) => {
    return {
      updateOne: {
        filter: { name: data.name },
        update: {
          ...data
        },
        upsert: true
      }
    };
  });
  await AssetModel.bulkWrite(dataToUpdate, { ordered: false });
  res.status(httpStatus.OK).send(response);
};

const createAsset = async (req: Request, res: Response): Promise<any> => {
  const data: AssetDocument = req.body as any;
  data.created_by = res.locals.user_id;
  try {
    const response = await offrIoService.createAsset(data);
    data.asset_id = response.id;

    const asset: AssetDocument = new AssetModel({ ...data });
    await asset.save();
    if (asset.property_images.length > 0) {
      offrIoService.addAssetDocument(asset.property_images, asset.asset_id).then((r) => console.log(r));
    }
    res.status(httpStatus.CREATED).send(asset.toObject());
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'property_not_saved' });
  }
};

const updateAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const asset = await findById(id);

    if (req.body.hasOwnProperty('status_string')) {
      asset.status_string = getCurrentStatusForPost(req.body.status_string);
    }

    if (req.body.hasOwnProperty('transaction_type_string')) {
      asset.transaction_type_string = req.body.transaction_type_string;
    }

    await asset.save();

    await offrIoService.updateAssetByAssetId(asset.asset_id, asset);

    res.status(httpStatus.OK).send(asset);
  } catch (error: any) {
    throw createError(400, { message: error?.message });
  }
};

const makeOffer = async (body: IOffer): Promise<any> => {
  return AssetModel.findOneAndUpdate(
    { _id: '646234b8723f31cea630853e' },
    { $push: { offers: body } },
    { new: true }
  );
};

const getById = async (req: Request, res: Response): Promise<any | null> => {
  const id = req.params.id;

  const asset: AssetDocument | null = await AssetModel.findOne({ _id: id });

  if (!asset) {
    throw createError(404, 'The item does not exist');
  }

  // @ts-ignore
  asset.property_images = asset.property_images.map((image: any) => {
    const { filename, ...rest } = image;
    return {
      filename: `${req.protocol}://${req.get('host')}/url-to-file/${image.filename}`,
      ...rest
    };
  });

  asset.status_string = getCurrentStatusForGet(asset.status_string);

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

export default {
  findAll,
  getById,
  createAsset,
  deleteAsset,
  makeOffer,
  syncAll,
  updateAsset,
  findById,
  sendAssetInvitation,
  getAssetImages
};
