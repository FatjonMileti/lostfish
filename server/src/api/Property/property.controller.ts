import { Router, Request, Response } from 'express';
import propertyService from './services/property.service';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import assetApplicationService from './services/asset-application.service';
import { createAssetSchemaValidation, createAssetSchemaValidationDraft } from './property.validation';
import paging from '../../middleware/paging';
import validateId from '../../middleware/object-id.validator';
import ability from '../../middleware/ability.middleware';
import { CASLAction } from '../../casl/casl.interface';
import { multipleUpload } from '../../utils/uploader';
import { FileService } from '../File/file.interface';
import createError from 'http-errors';
import httpStatus from 'http-status';
import {
  createWebSocketConnection,
  sendNewTaskMessage,
  sendNewConnectionMessage
} from '../../utils/imageFinder';

const router: Router = Router();

export class PropertyController {
  public path = '/';
  public router = router;
  public propertyService = propertyService;
  private readonly fileService: FileService;
  public assetApplicationService = assetApplicationService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      authorize(),
      paging({ sort: { created_at: -1 } }),
      ability(CASLAction.Read, 'Property'),
      this.findAll
    );
    this.router.get(
      '/:id/viewed-by',
      authorize(),
      validateId,
      paging({ sort: { created_at: -1 } }),
      this.getPropertyViewers
    );
    this.router.get('/:id/get-applications', authorize(), validateId, this.getAssetApplications);
    this.router.get('/:id/application', authorize(), validateId, this.getOneAssetApplication);
    this.router.post('/:id/send-application', authorize(), validateId, this.sendApplication);
    this.router.patch('/:id/approve-application', authorize(), validateId, this.approveApplication);
    this.router.patch('/:id/update-application', authorize(), validateId, this.updateApplication);
    this.router.get('/last', authorize(), this.getLatestProperty);
    this.router.get('/:id', authorize(), validateId, this.getById);
    this.router.post(this.path, authorize(), validator(createAssetSchemaValidation), this.createAsset);
    this.router.post(`${this.path}generate-images`, authorize(), this.generateImages);
    this.router.post(
      '/draft',
      authorize(),
      validator(createAssetSchemaValidationDraft),
      this.createAssetDraft
    );
    this.router.post('/upload', multipleUpload, authorize(), this.uploadAssetFile);
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
   * @api {get} /api/asset Get asset
   * @apiDescription Get all assets
   * @apiGroup Property
   * @apiSampleRequest /api/asset
   *
   * @apiQuery {string} [status] status
   * @apiPermission authorize
   * @apiUse bearer
   * @apiUse paging
   */
  private findAll = this.propertyService.findAll;

  /**
   * @api {get} /api/asset/:id/viewed-by Get property viewers
   * @apiDescription Get all property viewers
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id/viewed-by
   *
   * @apiPermission admin
   */
  private getPropertyViewers = this.propertyService.getPropertyViewers;

  /**
   * @api {get} /api/asset/:id/applications Get asset applications
   * @apiDescription Get all applications for an asset
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id/applications
   *
   * @apiPermission admin
   */
  private getAssetApplications = this.assetApplicationService.getAssetApplications;

  /**
   * @api {get} /api/asset/:id/application Get aset application
   * @apiDescription Get application for an asset
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id/application
   *
   * @apiPermission admin
   */
  private getOneAssetApplication = this.assetApplicationService.getOneAssetApplication;

  /**
   * @api {patch} /api/asset/:id/update-application Update asset application
   * @apiDescription Update an application for an asset
   * @apiGroup Property
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
   * @apiGroup Property
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
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id
   *
   * @apiParam id asset id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getById = this.propertyService.getById;

  /**
   * @api {get} /api/asset/last Get the latest property Live
   * @apiDescription Get property details
   * @apiGroup Property
   * @apiSampleRequest /api/asset/last
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getLatestProperty = this.propertyService.findLastAddedPropertyWithDetails;

  /**
   * @api {post} /api/asset/upload Upload documents
   * @apiDescription Upload property images (or other documents)
   * @apiGroup Property
   * @apiSampleRequest /api/asset/upload
   *
   * @apiHeader {String} Content-Type multipart/form-data
   * @apiParam {File[]} images Array of image files to upload.
   * @apiUse bearer
   */
  private uploadAssetFile = (req: Request, res: Response) =>
    this.propertyService.uploadAssetFiles(req, res, this.fileService);

  /**
   * @api {post} /api/asset Post
   * @apiDescription Add a new asset
   * @apiGroup Property
   * @apiSampleRequest /api/asset
   *
   * @apiUse CreateAsset
   * @apiUse CreateAssetExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAsset = this.propertyService.createAsset;

  /**
   * @api {post} /api/asset/generate-images Post
   * @apiDescription Generate property images
   * @apiGroup Property
   * @apiSampleRequest /api/asset/generate-images
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private generateImages = async (req: Request, res: Response) => {
    const prompt = req.body.prompt;
    if (!prompt) {
      throw createError(httpStatus.BAD_REQUEST, { message: 'Prompt is required' });
    }

    const ws = await createWebSocketConnection();

    let images: any[] = []; // Collect images here

    ws.on('message', (message: string) => {
      const response = JSON.parse(message.toString());

      if (response.hasOwnProperty('newConnectionSessionUUID')) {
        console.log('Logged in. Ready to get images');
        sendNewTaskMessage(ws, prompt);
      }

      if (response.hasOwnProperty('newImages')) {
        const newImages = response.newImages.images;
        images = images.concat(newImages); // Collect the images
        // Close the WebSocket connection after receiving images
        ws.close();
      }
    });

    ws.on('close', () => {
      res.json({ images });
    });
  };

  /**
   * @api {post} /api/asset/draft Post as draft
   * @apiDescription Add a new asset as draft
   * @apiGroup Property
   * @apiSampleRequest /api/asset/draft
   *
   * @apiUse CreateAsset
   * @apiUse CreateAssetDraftExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAssetDraft = this.propertyService.createAsset;

  /**
   * @api {patch} /api/asset/:id Patch one asset
   * @apiDescription Update existing asset
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id
   *
   * @apiUse CreateAsset
   * @apiUse UpdateAssetExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateAsset = this.propertyService.updateAsset;

  /**
   * @api {patch} /api/asset/:id/send-invitation Send invitation
   * @apiDescription Send invitation
   * @apiGroup Property
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
  private sendInvitation = this.propertyService.sendAssetInvitation;

  /**
   * @api {patch} /api/asset/:id/send-application Send application
   * @apiDescription Send application
   * @apiGroup Property
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
   * @apiGroup Property
   * @apiSampleRequest /api/asset/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = this.propertyService.deleteAsset;
}

/* API CONSTANTS FOR ASSET DOCUMENTATION */

/**
 * @apiDefine CreateAssetExample
 * @apiExample {json} Example request body:
 *    {
 *     "name": "",
 *      "title": "",
 *      "description": "",
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
 *      "budget": {
 *        "min_budget": 1500,
 *        "max_budget": 2800,
 *      },
 *      "parking_spot": 1,
        "epc_rating": B,
        "location_details": "",
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
 *      "title": "",
 *      "description": "",
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
 *      "budget": {
 *        "min_budget": 1500,
 *        "max_budget": 2800,
 *      },
 *      "parking_spot": 1,
        "epc_rating": A,
        "location_details": "",
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
 * @apiBody {String} title
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
 * @apiBody {Number} room_details.number_of_bathrooms
 * @apiBody {Number} room_details.number_of_bedrooms
 * @apiBody {Object} budget
 * @apiBody {Number} budget.min_budget
 * @apiBody {Number} budget.max_budget
 * @apiBody {Number} parking_spot
 * @apiBody {String} epc_rating
 * @apiBody {String} location_details
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
