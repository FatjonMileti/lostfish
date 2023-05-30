import { Request, response, Response, Router } from 'express';
import assetService from './asset.service';
import { AssetDocument, IOffer, OfferStatus } from './asset.interface';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import { Role } from '../../enums';
import * as joi from 'joi';
import createError from 'http-errors';
import fs from 'fs';
import util from 'util';
import sendInvitationTemplate from '../../utils/templates/sendInvitationTemplate';
import MailService from '../../utils/email';
import AssetInvitation, { InvitationDocument } from './schemas/asset-invitation.schema';
import { Types } from 'mongoose';
import sendApplication from '../../utils/templates/sendApplicationTemplate';
import AssetApplicationSchema, { ApplicationDocument, ApproveType } from './schemas/asset-application.schema';
import userService from '../User/user.service';
import generalTemplate from '../../utils/templates/generalTemplate';

const router: Router = Router();
const mailService = MailService.getInstance();
const schema = joi.object({
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
  currency_code: joi.string(),
  reserved: joi.boolean(),
  master_branch_name: joi.string(),
  asset_rent: joi.object({
    rental_amount: joi.number().allow(''),
    rental_frequency: joi.string().allow(''),
    deposit_amount: joi.number().allow(''),
    interest_by: joi.date().allow(''),
    available_from: joi.date().allow('')
  }),
  floor_size: joi.number().required(),
  floor_size_unit: joi.string().required(),
  asset_attribute: joi.array().items(
    joi.object({
      name: joi.string().required(),
      type: joi.string().required(),
      value: joi.number().required()
    })
  ),
  specific_property_features: joi.array().items(
    joi.object({
      name: joi.string().required(),
      value: joi.boolean()
    })
  ),
  property_images: joi.array(),
  preferences: joi.string().allow(''),
  property_features: joi.string().allow('')
});

export class AssetController {
  public path = '/';
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get('/:id/images', this.getImages);
    this.router.get('/:id/get-applications', authorize(), this.getApplications);
    this.router.get('/:id/application', authorize(), this.getApplication);
    this.router.get('/:id', this.getById);
    this.router.post(this.path, authorize([Role.Admin]), validator(schema), this.createAsset);
    this.router.patch('/:id/offer', authorize(), this.makeOffer);
    this.router.patch('/:id/approve', authorize(), this.approveApplication);
    this.router.post('/:id/send-invitation', authorize(), this.sendInvitation);
    this.router.post('/:id/send-application', authorize(), this.sendApplication);

    this.router.delete('/:id', authorize([Role.Admin]), this.delete);
  }

  /**
   * @api {get} /api/asset Get asset
   * @apiDescription Get all assets
   * @apiGroup Asset
   * @apiSampleRequest /api/asset
   *
   * @apiPermission admin
   */
  private getAll = async (req: Request, res: Response) => {
    try {
      const offers = await assetService.getAll({}, res.locals.paging_options);

      return res.send(offers);
    } catch (error: any) {
      return res.send(error?.response?.data);
    }
  };

  /**
   * @api {get} /api/asset/:id/applications Get asset
   * @apiDescription Get all applications for an asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/applications
   *
   * @apiPermission admin
   */
  private getApplications = async (req: Request, res: Response) => {
    const id = req.params.id;

    // tslint:disable-next-line:no-shadowed-variable
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
  };

  /**
   * @api {get} /api/asset/:id/application Get asset
   * @apiDescription Get application for an asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/application
   *
   * @apiPermission admin
   */
  private getApplication = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      // tslint:disable-next-line:no-shadowed-variable
      const response = await AssetApplicationSchema.findOne({ asset: id, applicant: res.locals.user_id });

      res.send(response);
    } catch (error: any) {
      console.log(error);
      res.status(400).send({ error });
    }
  };

  /**
   * @api {get} /api/asset/:id Get by Id
   * @apiDescription Get asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id
   *
   * @apiParam id asset id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const asset = await assetService.getById(id);

    asset.property_images = asset.property_images.map(
      (image: any) => `${req.protocol}://${req.get('host')}/url-to-file/${image.filename}`
    );
    return res.send(asset);
  };

  private getImages = async (req: Request, res: Response) => {
    const id = req.params.id;

    const asset = await assetService.getById(id);
    const readDir = util.promisify(fs.readdir);

    try {
      const imageUrls = asset.property_images.map(
        (image: any) => `${req.protocol}://${req.get('host')}/url-to-file/${image.filename}`
      );

      res.json(imageUrls);
    } catch (error) {
      console.error('Error reading directory:', error);
      res.status(500).send('Server error');
    }
  };

  /**
   * @api {post} /api/asset Post
   * @apiDescription Add a new asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset
   *
   * @apiBody {string} name
   * @apiBody {string} descrption
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  public createAsset = async (req: Request, res: Response) => {
    const asset: AssetDocument = req.body as any;
    try {
      // tslint:disable-next-line:no-shadowed-variable
      const response = await assetService.createAsset(asset);
      res.send({ ...response });
    } catch (error: any) {
      throw createError(400, { message: 'failed_to_save', error });
    }
  };

  /**
   * @api {patch} /api/asset/:id/offer Patch
   * @apiDescription Make an offer
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/offer
   *
   * @apiBody {number} amount
   * @apiBody {number} client_id
   * @apiPermission admin
   * @apiUse bearer
   */
  public makeOffer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer: IOffer = req.body as IOffer;

    if (res.locals.user_id != null) {
      offer.user_id = res.locals.user_id;
    }
    offer.created_at = new Date();
    offer.status = OfferStatus.Pending;
    offer.asset_id = id;
    // tslint:disable-next-line:no-shadowed-variable
    const response = await assetService.makeOffer(offer);

    return res.send(response);
  };

  /**
   * @api {patch} /api/asset/:id/approve Patch
   * @apiDescription Approve or pre-approve an application
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/approve
   *
   * @apiBody {boolean} approve_status
   * @apiPermission admin
   * @apiUse bearer
   */
  public approveApplication = async (req: Request, res: Response) => {
    const { id } = req.params;
    const preApproveStatus = req.body.pre_approve_status;
    const approveStatus = req.body.approve_status;
    const application = await AssetApplicationSchema.findOne({ _id: id });
    if (!application) {
      throw createError(404, { message: 'application_not_found' });
    }
    if (req.body.hasOwnProperty('pre_approve_status')) {
      application.pre_approve_status = Boolean(preApproveStatus);
      application.approve_type = ApproveType.APPROVE;
    }
    if (req.body.hasOwnProperty('approve_status')) {
      application.approve_status = Boolean(approveStatus);
    }

    await application.save();
    const asset = await assetService.getById(application.asset.toString());
    const emailTemplate = generalTemplate({
      link: `${process.env.FRONTEND_URL}/properties/${asset._id}`,
      assetName: asset.name,
      clientName: res.locals.username ?? '',
      body_1: `You have been added as a party member for: ${asset.name}`,
      body_2: `more details...`
    });

    const user = await userService.getById(res.locals.user_id as string);
    if (!user) {
      throw createError(401, { message: 'unauthorized_user' });
    }

    // @ts-ignore
    mailService.sendMail({
      to: user.email,
      subject: 'Invitation to the property',
      html: emailTemplate.html
    });
    res.send(application);
  };

  /**
   * @api {patch} /api/asset/:id/send-invitation Patch
   * @apiDescription Send invitation
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/send-invitation
   *
   * @apiBody {string} first_name
   * @apiBody {string} last_name
   * @apiBody {string} email
   * @apiBody {string} phone
   * @apiBody {string} invite_reason
   * @apiBody {string} invite_type
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  public sendInvitation = async (req: Request, res: Response) => {
    const id = req.params.id;
    const invitationDocument = req.body as InvitationDocument;
    const asset = await assetService.getById(id);

    const invitationTemplate = sendInvitationTemplate({
      link: `${process.env.FRONTEND_URL}/properties/${asset._id}/view`,
      assetName: asset.name,
      clientName: invitationDocument.first_name
    });

    // @ts-ignore
    invitationDocument.created_by = new Types.ObjectId(res.locals.user_id);
    invitationDocument.asset = asset._id;

    const newInvitation: InvitationDocument = await AssetInvitation.create({ ...invitationDocument });

    // @ts-ignore
    await mailService.sendMail({
      to: req.body.email,
      subject: 'Invitation to the property',
      html: invitationTemplate.html
    });

    res.send(newInvitation);
  };

  /**
   * @api {patch} /api/asset/:id/send-application Patch
   * @apiDescription Send application
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/send-application
   *
   * @apiBody {boolean} have_pets
   * @apiBody {string} adult_applicants
   * @apiBody {string} [participants]
   * @apiBody {string} approve_type
   * @apiBody {string} moving_date
   * @apiBody {object} approve_type
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  public sendApplication = async (req: Request, res: Response) => {
    const id = req.params.id;
    const applicationDocument = req.body as ApplicationDocument;
    const asset = await assetService.getById(id);

    const invitationTemplate = sendApplication({
      link: `${process.env.FRONTEND_URL}/properties/${asset._id}`,
      assetName: asset.name,
      clientName: res.locals.username ?? ''
    });

    // @ts-ignore
    applicationDocument.created_by = new Types.ObjectId(res.locals.user_id);
    applicationDocument.asset = asset._id;
    applicationDocument.agreed_terms = req.body.agreed_terms === 'Yes';
    // @ts-ignore
    applicationDocument.applicant = new Types.ObjectId(res.locals.user_id);
    const newApplication: ApplicationDocument = await AssetApplicationSchema.create({
      ...applicationDocument
    });

    const loggedUser = await userService.getById(res.locals.user_id as string);
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

  /**
   * @api {delete} /api/asset/:id Delete
   * @apiDescription Delete asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      await assetService.deleteAsset(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'Asset not found' });
    }
  };
}
