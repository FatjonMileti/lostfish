import { Request, Response, Router } from 'express';
import assetService from './asset.service';
import { AssetDocument, IOffer, OfferStatus } from '../../data/interfaces/asset.interface';
import { validate, ValidationError } from 'class-validator';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import { Role } from '../../enums';
import * as joi from 'joi';

const router: Router = Router();

export class AssetController {
  public path = '/';
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get('/:id', authorize([Role.Admin]), this.getById);
    this.router.post(
      this.path,
      authorize([Role.Admin]),
      validator(
        joi
          .object({
            name: joi.string().required(),
            description: joi.string().required()
          })
          .unknown()
      ),
      this.createAsset
    );
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
    return res.json(asset);
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
    const response = await assetService.createAsset();
    res.send({ ...response });
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
