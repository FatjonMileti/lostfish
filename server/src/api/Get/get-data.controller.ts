import { Router } from 'express';
import assetService from '../Asset/services/asset.service';
import userService from '../User/user.service';

const router: Router = Router();

export class ProtectedApiController {
  public path = '/';
  public router = router;
  public assetService = assetService;
  public userService = userService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/asset/get', this.getPublishedAssets);
    this.router.get('/user/get', this.getUsers);
  }

  /**
   * @api {get} /api/public/asset/get Get asset
   * @apiDescription Get all assets
   * @apiGroup Public
   * @apiSampleRequest /api/public/asset/get
   */
  private getPublishedAssets = this.assetService.findPublishedProperties;

  /**
   * @api {get} /api/public/user/get Get users
   * @apiDescription Get all users with their criteria
   * @apiGroup Public
   * @apiSampleRequest /api/public/user/get
   *
   */
  private getUsers = this.userService.getUserPublicData;
}
