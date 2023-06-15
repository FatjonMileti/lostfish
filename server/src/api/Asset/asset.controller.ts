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
    this.router.get('/:id', authorize(), validateId, this.getById);
    this.router.post(this.path, authorize(), validator(createAssetSchemaValidation), this.createAsset);
    this.router.post('/:id/send-invitation', authorize(), validateId, authorize(), this.sendInvitation);
    this.router.patch('/:id', authorize(), validateId, this.updateAsset);
    this.router.delete('/:id', authorize(), validateId, this.delete);
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
   * @apiBody {string} area_of_interest
   * @apiBody {string} radius
   * @apiBody {object} asset_address
   * @apiBody {number} asset_address.latitude
   * @apiBody {number} asset_address.longitude
   * @apiBody {string} asset_address.street_number
   * @apiBody {string} asset_address.route
   * @apiBody {string} asset_address.neighbourhood
   * @apiBody {string} asset_address.postal_town
   * @apiBody {string} asset_address.postal_code
   * @apiBody {string} asset_address.administrative_area_level_1
   * @apiBody {string} asset_address.country_code
   * @apiBody {string} asset_address.text
   * @apiBody {string} status_string
   * @apiBody {string} transaction_type_string
   * @apiBody {string} master_asset_type_string
   * @apiBody {string} property_type
   * @apiBody {string} currency_code
   * @apiBody {object} asset_rent
   * @apiBody {string} asset_rent.rental_amount
   * @apiBody {string} asset_rent.rental_frequency
   * @apiBody {string} asset_rent.deposit_amount
   * @apiBody {Date} asset_rent.interest_by
   * @apiBody {Date} asset_rent.available_from
   * @apiBody {number} floor_size
   * @apiBody {string} floor_size_unit
   * @apiBody {Object} property_preferences
   * @apiBody {boolean} property_preferences.new_home
   * @apiBody {boolean} property_preferences.retirement_home
   * @apiBody {boolean} property_preferences.shared_ownership
   * @apiBody {boolean} property_preferences.auction
   * @apiBody {Object} room_details
   * @apiBody {string} room_details.number_of_bathrooms
   * @apiBody {string} room_details.number_of_bedrooms
   * @apiBody {Object[]} specific_property_features
   * @apiBody {string} specific_property_features.name
   * @apiBody {boolean} specific_property_features.value
   *
   * @apiBody {Object[]} property_images
   * @apiBody {string} property_images.originalName
   * @apiBody {string} property_images.filename
   * @apiBody {string} property_images.path
   * @apiBody {string} preferences
   * @apiBody {Object} property_features
   * @apiBody {boolean} property_features.parks_nearby
   * @apiBody {boolean} property_features.public_transport_nearby
   * @apiBody {boolean} property_features.shopping_centers_nearby
   * @apiExample {json} Example request body:
   *    {
   *     "name": "",
   *     "area_of_interest": "",
   *     "radius": "0",
   *     "asset_address": {
   *         "latitude": 0,
   *         "longitude": 0,
   *         "street_number": "",
   *         "route": "",
   *         "neighbourhood": "",
   *         "postal_town": "",
   *         "postal_code": "",
   *         "administrative_area_level_1": "",
   *         "country_code": "GBR",
   *         "text": ""
   *     },
   *     "status_string": "Draft",
   *     "transaction_type_string": "Rent",
   *     "property_type": "",
   *     "asset_rent": {
   *         "rental_amount": "1200",
   *         "rental_frequency": "Month",
   *         "deposit_amount": "200",
   *         "interest_by": "6/15/2023",
   *         "available_from": "6/15/2023"
   *     },
   *     "floor_size": 0,
   *     "floor_size_unit": "",
   *     "property_preference": "New Home",
   *     "room_details": {
   *         "number_of_bathrooms": 1,
   *         "number_of_bedrooms": 1
   *     },
   *     "property_features": ["Parks Nearby"],
   *     "specific_property_features": ["Garden","Terrace"]
   * }
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
