import { Router } from 'express';
import criteriaService from './services/criteria.service';
import authorize from '../../middleware/authorize';

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
    this.router.get(this.path, authorize(), this.getCriteria);
    this.router.get('/:id', authorize(), validateId, this.getById);
    this.router.post(this.path, authorize(), this.createCriteria);
    this.router.patch('/', authorize(), validateId, this.updateCriteria);
  }

  /**
   * @api {get} /api/criteria Get criteria associated with user
   * @apiDescription Get criteria for logged in user
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria
   *
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getCriteria = this.criteriaService.getByUserId;

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
   * @apiUse CreateCriteria
   * @apiUse CreateCriteriaExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createCriteria = this.criteriaService.createCriteria;

  /**
   * @api {patch} /api/criteria Patch criteria
   * @apiDescription Update existing criteria for logged in user
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria
   *
   * @apiUse CreateCriteria
   * @apiUse CreateCriteriaExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateCriteria = this.criteriaService.updateCriteria;
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
 *      "moving_time": "This month"
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
 *     "looking_for": "I own a place",
 *     "moving_time": "This month"
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
