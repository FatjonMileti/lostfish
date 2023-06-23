import { Router, Response, Request } from 'express';
import assetService from './services/asset.service';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import assetApplicationService from './services/asset-application.service';
import { createAssetSchemaValidation, createAssetSchemaValidationDraft } from './asset.validation';
import paging from '../../middleware/paging';
import validateId from '../../middleware/object-id.validator';
import ability from '../../middleware/ability.middleware';
import { CASLAction } from '../../casl/casl.interface';
import httpStatus from 'http-status';
const fs = require('fs');
const path = require('path');

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
      authorize(),
      paging({ sort: { created_at: -1 } }),
      ability(CASLAction.Read, 'Asset'),
      this.findAll
    );
    this.router.get('/sync', this.syncAll);
    this.router.get('/:id/images', authorize(), validateId, this.getImages);
    this.router.get('/:id/get-applications', authorize(), this.getAssetApplications);
    this.router.get('/:id/application', authorize(), validateId, this.getOneAssetApplication);
    this.router.post('/:id/send-application', authorize(), validateId, this.sendApplication);
    this.router.patch('/:id/approve-application', authorize(), validateId, this.approveApplication);
    this.router.patch('/:id/update-application', authorize(), validateId, this.updateApplication);
    this.router.get('/:id/image/:imageId', validateId, this.getSingleImage);
    this.router.get('/:id', authorize(), validateId, this.getById);
    this.router.post(this.path, authorize(), validator(createAssetSchemaValidation), this.createAsset);
    this.router.post(
      '/draft',
      authorize(),
      validator(createAssetSchemaValidationDraft),
      this.createAssetDraft
    );
    this.router.post('/:id/send-invitation', authorize(), validateId, authorize(), this.sendInvitation);
    this.router.patch(
      '/:id',
      authorize(),
      validateId,
      validator(createAssetSchemaValidationDraft),
      this.updateAsset
    );
    this.router.delete('/:id', authorize(), validateId, this.delete);
  }

  /**
   * @api {get} /api/asset/:id/image/:imageId Get asset image
   * @apiDescription Get single image
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id/image/:imageId
   */
  private getSingleImage = this.assetService.getSingleImage;

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
   * @apiUse CreateAsset
   * @apiUse CreateAssetExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAsset = this.assetService.createAsset;

  /**
   * @api {post} /api/asset/draft Post as draft
   * @apiDescription Add a new asset as draft
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/draft
   *
   * @apiUse CreateAsset
   * @apiUse CreateAssetDraftExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAssetDraft = this.assetService.createAsset;

  /**
   * @api {patch} /api/asset/:id Patch one asset
   * @apiDescription Update existing asset
   * @apiGroup Asset
   * @apiSampleRequest /api/asset/:id
   *
   * @apiUse CreateAsset
   * @apiUse UpdateAssetExample
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

/* API CONSTANTS FOR ASSET DOCUMENTATION */

/**
 * @apiDefine CreateAssetExample
 * @apiExample {json} Example request body:
 *    {
 *     "name": "",
 *     "area_of_interest": "",
 *     "radius": "0",
 *     "asset_address": {
 *         "latitude": 0,
 *         "longitude": 0
 *     },
 *     "status_string": "Draft",
 *     "transaction_type_string": "Rent",
 *     "property_type": "Detached",
 *     "asset_rent": {
 *         "rental_amount": "1200",
 *         "rental_frequency": "Month",
 *         "deposit_amount": "200",
 *         "interest_by": "6/15/2023",
 *         "available_from": "6/15/2023"
 *     },
 *     "floor_size": 0,
 *     "property_preference": "New Home",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "property_features": ["Parks Nearby"],
 *     "specific_property_features": ["Garden","Terrace"],
 *     "property_images": [{"originalName":"filename.jpg","filename":"jhsdcjhg4t87fdsvidsvi","path":"/uploads/images/jhsdcjhg4t87fdsvidsvi"}],
 *     "credit_score_requirements": "Good",
 *     "contact_details": ["Guarantor"]
 * }
 */

/**
 * @apiDefine CreateAssetDraftExample
 * @apiExample {json} Example request body:
 *    {
 *     "name": "",
 *     "area_of_interest": "",
 *     "radius": "0",
 *     "status_string": "Draft",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     },
 *     "property_type": "",
 *     "asset_rent": {
 *         "rental_amount": "",
 *         "rental_frequency": "",
 *         "deposit_amount": "",
 *         "interest_by": "",
 *         "available_from": ""
 *     },
 *     "floor_size": 0,
 *     "property_preference": "",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "property_features": [""],
 *     "specific_property_features": [],
 *     "property_images": [],
 *     "credit_score_requirements": "",
 *     "contact_details": []
 * }
 */

/**
 * @apiDefine UpdateAssetExample
 * @apiExample {json} Example request body:
 *    {
 *     "status_string": "Draft",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     }
 * }
 */

/**
 * @apiDefine CreateAsset
 * @apiBody {String} name
 * @apiBody {String} area_of_interest
 * @apiBody {String} radius
 * @apiBody {Object} asset_address
 * @apiBody {Number} asset_address.latitude
 * @apiBody {Number} asset_address.longitude
 * @apiBody {String} status_string
 * @apiBody {String} transaction_type_string
 * @apiBody {String} property_type
 * @apiBody {Object} asset_rent
 * @apiBody {String} asset_rent.rental_amount
 * @apiBody {String} asset_rent.rental_frequency
 * @apiBody {String} asset_rent.deposit_amount
 * @apiBody {Date} asset_ren.interest_by
 * @apiBody {Date} asset_rent.available_from
 * @apiBody {Number} floor_size
 * @apiBody {String} floor_size_unit
 * @apiBody {String[]} property_preference An array of property preferences.
 * @apiBody {Object} room_details
 * @apiBody {String} room_details.number_of_bathrooms
 * @apiBody {String} room_details.number_of_bedrooms
 * @apiBody {String[]} specific_property_features An array of property Specific property features.
 * @apiBody {String} credit_score_requirements
 * @apiBody {Object[]} property_images An array of property images
 * @apiBody {String} property_images.originalName
 * @apiBody {String} property_images.filename
 * @apiBody {String} property_images.path
 * @apiBody {String[]} property_features An array of property features.
 * @apiBody {String} credit_score_requirements
 * @apiBody {String[]} contact_details An array of contact details
 *
 */
