import { Router } from 'express';
import criteriaService from './services/criteria.service';
import authorize from '../../middleware/authorize';
import validator from '../../middleware/validator';
import { createAssetSchemaValidation, createAssetSchemaValidationDraft } from './criteria.validation';

import validateId from '../../middleware/object-id.validator';

const router: Router = Router();

export class CriteriaController {
  public path = '/';
  public router = router;
  public criteriaService = criteriaService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:id', authorize(), validateId, this.getById);
    this.router.post(this.path, authorize(), this.createAsset);
    this.router.post('/draft', authorize(), this.createAssetDraft);
    this.router.patch('/:id', authorize(), validateId, this.updateAsset);
    this.router.delete('/:id', authorize(), validateId, this.delete);
  }

  /**
   * @api {get} /api/criteria/:id Get by Id
   * @apiDescription Get criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/:id
   *
   * @apiParam id asset id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getById = this.criteriaService.getById;

  /**
   * @api {post} /api/asset Post
   * @apiDescription Add a new criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria
   *
   * @apiUse CreateAsset
   * @apiUse CreateCriteriaExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAsset = this.criteriaService.createAsset;

  /**
   * @api {post} /api/criteria/draft Post as draft
   * @apiDescription Add a new criteria as draft
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/draft
   *
   * @apiUse CreateCriteria
   * @apiUse CreateCriteriaDraftExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAssetDraft = this.criteriaService.createAsset;

  /**
   * @api {patch} /api/criteria/:id Patch one criteria
   * @apiDescription Update existing criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/:id
   *
   * @apiUse CreateAsset
   * @apiUse UpdateAssetExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateAsset = this.criteriaService.updateAsset;

  /**
   * @api {delete} /api/criteria/:id Delete
   * @apiDescription Delete criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = this.criteriaService.deleteAsset;
}

/* API CONSTANTS FOR ASSET DOCUMENTATION */

/**
 * @apiDefine CreateCriteriaExample
 * @apiExample {json} Example request body:
 *    {
 *     "budget": "100 - 1000",
 *     "area_of_interest": "",
 *     "radius": "0",
 *     "asset_address": {
 *         "latitude": 0,
 *         "longitude": 0
 *     },
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
 *     "credit_score_requirements": "Good"
 * }
 */

/**
 * @apiDefine CreateCriteriaDraftExample
 * @apiExample {json} Example request body:
 *    {
 *     "budget": "100 - 1000",
 *     "area_of_interest": "",
 *     "radius": "0",
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
 *     "credit_score_requirements": "",
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
 * @apiDefine CreateCriteria
 * @apiBody {String} area_of_interest
 * @apiBody {String} budget
 * @apiBody {String} radius
 * @apiBody {Object} asset_address
 * @apiBody {Number} asset_address.latitude
 * @apiBody {Number} asset_address.longitude
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
 * @apiBody {String[]} property_features An array of property features.
 *
 */
