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
    this.router.post(this.path, authorize(), this.createCriteria);
    this.router.post('/draft', authorize(), this.createCriteriaDraft);
    this.router.patch('/:id', authorize(), validateId, this.updateCriteria);
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
   * @api {post} /api/criteria Post new criteria
   * @apiDescription Add a new criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria
   *
   * @apiUse CreateAsset
   * @apiUse CreateCriteriaExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createCriteria = this.criteriaService.createCriteria;

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
  private createCriteriaDraft = this.criteriaService.createCriteria;

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
  private updateCriteria = this.criteriaService.updateCriteria;

  /**
   * @api {delete} /api/criteria/:id Delete
   * @apiDescription Delete criteria
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = this.criteriaService.deleteCriteria;
}

/* API CONSTANTS FOR CRITERIA DOCUMENTATION */

/**
 * @apiDefine CreateCriteriaExample
 * @apiExample {json} Example request body:
 *   {
 *     "area_of_interest": "London, Uk",
 *     "budget": "100 - 1000",
 *     "radius": "0",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     },
 *     "property_type": "Detached",
 *     "property_preferences": ["New Homes","Auction"],
 *     "floor_size": "80 - 100",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "property_features": ["Park nearby","Shoping centers nearby"],
 *     "specific_property_features": ["Parking spot"],
 *     "credit_score_requirements": "Excellent",
 *      "looking_for": "I own a place",
 *      "moving_time": "2023-07-11",
 * }
 */

/**
 * @apiDefine CreateCriteriaDraftExample
 * @apiExample {json} Example request body:
 *    {
 *     "area_of_interest": "London, Uk",
 *     "budget": "100 - 1000",
 *     "radius": "0",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     },
 *     "property_type": "Detached",
 *     "property_preferences": ["New Homes","Auction"],
 *     "floor_size": "80 - 100",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "property_features": ["Park nearby","Shoping centers nearby"],
 *     "specific_property_features": ["Parking spot"],
 *     "credit_score_requirements": "Excellent",
 *      "looking_for": "I own a place",
 *      "moving_time": "2023-07-11",
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
 * @apiBody {Object} asset_address
 * @apiBody {Number} asset_address.latitude
 * @apiBody {Number} asset_address.longitude
 * @apiBody {String} radius
 * @apiBody {String[]} property_type
 * @apiBody {String[]} property_class
 * @apiBody {String[]} property_features An array of property features.
 * @apiBody {Number} floor_size
 * @apiBody {Object} room_details
 * @apiBody {String} room_details.number_of_bathrooms
 * @apiBody {String} room_details.number_of_bedrooms
 * @apiBody {String[]} specific_property_features An array of property Specific property features.
 * @apiBody {String} credit_score_requirements
 * @apiBody {String} budget
 * @apiBody {String} transaction_type_string
 * @apiBody {String[]} property_features An array of property features.
 * @apiBody {String} looking_for
 * @apiBody {String} moving_time
 *
 */
