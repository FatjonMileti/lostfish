import { Router } from 'express';
import assetService from '../Asset/services/asset.service';
import userService from '../User/user.service';
import tokenAuthorize from '../../middleware/tokenAuthorize';
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
    this.router.get('/property/get', tokenAuthorize(), this.getPublishedAssets);
    this.router.get('/user/get', tokenAuthorize(), this.getUsers);
  }

  /**
   * @api {get} /api/v1/property/get Get published properties
   * @apiDescription Get all published properties
   * @apiGroup MatchesData
   * @apiSampleRequest /api/v1/property/get
   * @apiHeader {String} Token Authentication token.
   */
  private getPublishedAssets = this.assetService.findPublishedProperties;

  /**
   * @api {get} /api/v1/user/get Get users
   * @apiDescription Get all users with their criteria
   * @apiGroup MatchesData
   * @apiSampleRequest /api/v1/user/get
   * @apiHeader {String} Token Authentication token.
   */
  private getUsers = this.userService.getUserPublicData;
}
