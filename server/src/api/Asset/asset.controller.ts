import { Router } from 'express';
import assetService from './services/asset.service';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import { Role } from '../../enums';
import assetApplicationService from './services/asset-application.service';
import { createAssetSchemaValidation } from './asset.validation';
import paging from '../../middleware/paging';
import validateId from '../../middleware/object-id.validator';
import ability from '../../middleware/ability.middleware';
import { CASLAction } from '../../casl/casl.interface';

const router: Router = Router();

export class AssetController {
  public path = '/';
  public router = router;
  public assetService = assetService;
  public assetApplicationService = assetApplicationService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      paging({ sort: { created_at: -1 } }),
      ability(CASLAction.Read, 'Asset'),
      this.findAll
    );
    this.router.get('/sync', this.syncAll);
    this.router.get('/:id/images', validateId, this.getImages);
    this.router.get('/:id/get-applications', this.getAssetApplications);
    this.router.get('/:id/application', validateId, this.getOneAssetApplication);
    this.router.post('/:id/send-application', validateId, this.sendApplication);
    this.router.patch('/:id/approve-application', validateId, this.approveApplication);
    this.router.patch('/:id/update-application', validateId, this.updateApplication);
    this.router.get('/:id', validateId, this.getById);
    this.router.post(this.path, authorize(), validator(createAssetSchemaValidation), this.createAsset);
    this.router.post('/:id/send-invitation', validateId, authorize(), this.sendInvitation);
    this.router.patch('/:id', validateId, this.updateAsset);
    this.router.delete('/:id', validateId, this.delete);
  }

  /**
   * @api {get} /api/asset Get asset
   * @apiDescription Get all assets
   * @apiGroup Asset
   * @apiSampleRequest /api/asset
   *
   * @apiQuery {string} [status] status
   * @apiPermission authorize
   * @apiUse bearer
   * @apiUse paging
   */
  private findAll = this.assetService.findAll;

  /**
   * @api {get} /api/asset/sync Temporary asset syncing from offr.io
   * @apiDescription Get all assets
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/sync
   *
   * @apiPermission authorize
   * @apiUse bearer
   * @apiUse paging
   */
  private syncAll = this.assetService.syncAll;

  /**
   * @api {get} /api/asset/:id/applications Get asset applications
   * @apiDescription Get all applications for an asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/applications
   *
   * @apiPermission admin
   */
  private getAssetApplications = this.assetApplicationService.getAssetApplications;

  /**
   * @api {get} /api/asset/:id/application Get aset application
   * @apiDescription Get application for an asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/application
   *
   * @apiPermission admin
   */
  private getOneAssetApplication = this.assetApplicationService.getOneAssetApplication;

  /**
   * @api {patch} /api/asset/:id/update-application Update asset application
   * @apiDescription Update an application for an asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/update-application
   *
   * @apiBody {documents} any
   * @apiBody {paymant} any
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateApplication = this.assetApplicationService.updateAssetApplication;

  /**
   * @api {patch} /api/asset/:id/approve-application Approve or pre-approve an application
   * @apiDescription Approve or pre-approve an application
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/approve-application
   *
   * @apiBody {boolean} approve_status
   * @apiPermission admin
   * @apiUse bearer
   */
  private approveApplication = this.assetApplicationService.approveAssetApplication;

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
  private getById = this.assetService.getById;

  /**
   * @api {get} /api/asset/:id/images Get asset images
   * @apiDescription Get asset images
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/images
   *
   * @apiParam id asset id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getImages = this.assetService.getAssetImages;

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
  private createAsset = this.assetService.createAsset;

  /**
   * @api {patch} /api/asset/:id Patch one asset
   * @apiDescription Update existing asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id
   *
   * @apiBody {string} status_string
   * @apiBody {string} transaction_type_string
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateAsset = this.assetService.updateAsset;

  /**
   * @api {patch} /api/asset/:id/send-invitation Send invitation
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
  private sendInvitation = this.assetService.sendAssetInvitation;

  /**
   * @api {patch} /api/asset/:id/send-application Send application
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
  private sendApplication = this.assetApplicationService.sendApplicationForAsset;

  /**
   * @api {delete} /api/asset/:id Delete
   * @apiDescription Delete asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = this.assetService.deleteAsset;
}
