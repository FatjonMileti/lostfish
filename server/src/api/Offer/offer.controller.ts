import { Router, Request, Response } from 'express';
import offerService from './offer.service';

const router: Router = Router();

export class OfferController {
  public path = '/';
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.createAsset);
  }

  /**
   * @api {get} /api/offer Get offer
   * @apiDescription Get all offer
   * @apiGroup Offer
   * @apiSampleRequest /api/offer
   *
   * @apiPermission admin
   */
  private getAll = async (req: Request, res: Response) => {
    try {
      const offers = await offerService.getAll();
      return res.send(offers);
    } catch (error: any) {
      return res.send(error?.response?.data);
    }
  }
  
  /**
   * @api {post} /api/offer Post
   * @apiDescription Add a new asset
   * @apiGroup Offer
   * @apiSampleRequest /api/offer
   *
   * @apiBody {string} name
   * @apiBody {string} descrption
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  public createAsset = async (req: Request, res: Response) => {
    const response = await offerService.createAsset();
    res.send({ ok: true });
  }
}
