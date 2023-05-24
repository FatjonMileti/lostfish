import { Request, Response, Router } from 'express';
import assetService from './asset.service';
import { AssetDocument, IOffer, OfferStatus } from '../../data/interfaces/asset.interface';
import { validate, ValidationError } from 'class-validator';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import { Role } from '../../enums';
import * as joi from 'joi';

const router: Router = Router();

const schema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  asset_address: joi.object({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    street_number: joi.string(),
    route: joi.string(),
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
  master_branch_name: joi.string()
});

export class AssetController {
  public path = '/';
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get('/:id', authorize([Role.Admin]), this.getById);
    this.router.post(this.path, authorize([Role.Admin]), validator(schema), this.createAsset);
    this.router.patch('/:id/offer', authorize(), this.makeOffer);
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
    return res.send(asset);
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
    const asset: AssetDocument = req.body as AssetDocument;
    const errors: ValidationError[] = await validate(asset);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    return res.send({ ...asset });
    // const response = await assetService.createAsset();
    // res.send({ ...response });
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
    const response = await assetService.makeOffer(offer);

    return res.send(response);
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
