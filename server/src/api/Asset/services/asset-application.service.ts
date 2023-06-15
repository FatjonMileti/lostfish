import { Request, Response } from 'express';
import AssetApplicationSchema, {
  ApplicationDocument,
  ApproveType
} from '../schemas/asset-application.schema';
import createError from 'http-errors';
import assetService from './asset.service';
import { Types } from 'mongoose';
import userService from '../../User/user.service';
import sendApplicationTemplate from '../../../utils/templates/sendApplicationTemplate';
import { RentStatusString } from '../asset.interface';
import generalTemplate from '../../../utils/templates/generalTemplate';
import offrIoService from '../../../external-services/offr-io.service';
import { getCurrentStatusForPost } from '../helpers';
import MailService from '../../../utils/email';
import httpStatus from 'http-status';
const mailService = MailService.getInstance();

const getAssetApplications = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const response = await AssetApplicationSchema.paginate(
      { asset: { $eq: id } },
      {
        ...res.locals.paging_options,
        populate: [
          {
            path: 'applicant',
            select: ['first_name', 'last_name']
          },
          { path: 'asset' }
        ]
      }
    );
    res.send(response);
  } catch (error: any) {
    throw createError(400, { message: error?.message ?? 'error on fetching applications' });
  }
};

const getOneAssetApplication = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const response = await AssetApplicationSchema.findOne({
      asset: id,
      applicant: res.locals.user_id
    }).populate('asset', ['asset_rent']);

    res.send(response);
  } catch (error: any) {
    res.status(400).send({ error });
  }
};

const sendApplicationForAsset = async (req: Request, res: Response) => {
  const id = req.params.id;
  const applicationDocument = req.body as ApplicationDocument;
  const asset = await assetService.findById(id);

  const invitationTemplate = sendApplicationTemplate({
    link: `${process.env.FRONTEND_URL}/properties/${asset._id}`,
    assetName: asset.name,
    clientName: res.locals.username ?? ''
  });

  // @ts-ignore
  applicationDocument.created_by = new Types.ObjectId(res.locals.user_id);
  applicationDocument.asset = asset._id;
  applicationDocument.agreed_terms = req.body.agreed_terms === 'Yes';
  applicationDocument.have_pets = req.body.will_have_pets === 'Yes';
  // @ts-ignore
  applicationDocument.applicant = new Types.ObjectId(res.locals.user_id);
  const newApplication: ApplicationDocument = await AssetApplicationSchema.create({
    ...applicationDocument
  });

  const loggedUser = await userService.findOne({ _id: res.locals.user_id as string });
  if (!loggedUser) {
    throw createError(404, { message: 'user_not_found' });
  }
  // @ts-ignore
  await mailService.sendMail({
    to: loggedUser.email,
    subject: 'Your rent application has been received: ' + asset.name,
    html: invitationTemplate.html
  });

  res.send(newApplication);
};

const updateAssetApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await AssetApplicationSchema.findOne({ applicant: res.locals.user_id, asset: id });
    if (!application) {
      throw createError(404, { message: 'application_not_found' });
    }
    if (req.body.hasOwnProperty('documents')) {
      application.documents = req.body.documents;
    }

    if (req.body.hasOwnProperty('payment') && req.body.payment) {
      application.application_status = 'Completed';
      const asset = await assetService.findById(application.asset.toString());
      /* TODO This is to be updated. Right now we make property completed when client makes payment, but need to be done when agent confirm it */
      asset.status_string = 'Completed';
      await offrIoService.updateAssetByAssetId(asset.asset_id, asset);
      await asset.save();
    }

    await application.save();
    res.send(application);
  } catch (error: any) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const approveAssetApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const preApproveStatus = req.body.pre_approve_status;
  const approveStatus = req.body.approve_status;
  const application = await AssetApplicationSchema.findOne({ _id: id });
  if (!application) {
    throw createError(404, { message: 'application_not_found' });
  }
  const asset = await assetService.findById(application.asset.toString());
  let preApproveContent: string = '';
  let approveContent: string = '';
  if (req.body.hasOwnProperty('pre_approve_status')) {
    application.pre_approve_status = Boolean(preApproveStatus);
    application.approve_type = ApproveType.APPROVE;
    preApproveContent = `You have been added as a party member for: ${asset.name}`;
    approveContent = '..';
  }

  const user = await userService.findOne({ _id: res.locals.user_id as string });
  if (!user) {
    throw createError(401, { message: 'unauthorized_user' });
  }

  if (req.body.hasOwnProperty('approve_status')) {
    application.approve_status = Boolean(approveStatus);
    preApproveContent = `Your request to rent: ${asset.name} has been approved`;
    approveContent = 'more content...';

    asset.status_string = getCurrentStatusForPost(RentStatusString.LetAgreed);

    await offrIoService.updateAssetByAssetId(asset.asset_id, asset);
    if (!asset.buyers) {
      asset.buyers = [];
    }
    const applicant = await userService.findOne({ _id: application.applicant.toString() });
    if (applicant) {
      asset.buyers.push({
        client: {
          id: applicant?.user_id,
          first_name: applicant.first_name,
          surname: applicant.last_name,
          email: applicant.email,
          phone: applicant.phone
        }
      });
    }
    await asset.save();
  }

  if (req.body.hasOwnProperty('documents')) {
    application.documents = req.body.documents;
  }

  await application.save();

  const emailTemplate = generalTemplate({
    link: `${process.env.FRONTEND_URL}/properties/${asset._id}`,
    assetName: asset.name,
    clientName: res.locals.username ?? '',
    body_1: preApproveContent,
    body_2: approveContent
  });

  // @ts-ignore
  mailService.sendMail({
    to: user.email,
    subject: 'Invitation to the property',
    html: emailTemplate.html
  });
  res.send(application);
};

export default {
  getAssetApplications,
  getOneAssetApplication,
  sendApplicationForAsset,
  updateAssetApplication,
  approveAssetApplication
};
