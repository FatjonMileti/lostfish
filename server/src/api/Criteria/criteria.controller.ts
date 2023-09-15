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
    this.router.get('/', authorize(), this.getCriteria);
    this.router.post('/', authorize(), this.createCriteria);
    this.router.patch('/', authorize(), this.updateCriteria);
    this.router.get('/:id', authorize(), validateId, this.getById);
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
 *     "budgetFor": "Week",
 *     "budget": "100 - 1000",
 *     "radius": "0",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     },
 *     "property_type": [ "Detached", "Semi-Detached" ],
 *     "deposit_amount": "2",
 *     "contract_details": [ "Guarantor", "Reviewed Property" ],
 *     "property_preferences": ["New Homes","Auction"],
 *     "floor_size": "80 - 100",
 *     "floor_size_unit": "sq.m",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "parking_details": ["Garage"],
 *     "flat_details" :{
 *          "property_purpose": "Purpose built",
 *          "floor": 15,
 *          "lift": true,
 *          "security": false,
 *     },
 *     "outside_space": ["Garden","Balcony"],
 *     "distance_from_underground": {
 *         "value": 1,
 *         "unit": "km"
 *      },
 *      "distance_from_schools": {
 *         "value": 200,
 *         "unit": "m"
 *      },
 *      "distance_from_high_street": {
 *         "value": 200,
 *         "unit": "ft"
 *      },
 *      "distance_from_gym": {
 *          "value": 200,
 *          "unit": "m"
 *      },
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
 *     "budgetFor": "Week",
 *     "budget": "100 - 1000",
 *     "radius": "0",
 *     "transaction_type_string": "Rent",
 *     "asset_address": {
 *         "latitude": "",
 *         "longitude": ""
 *     },
 *     "property_type": [ "Detached", "Semi-Detached" ],
 *     "deposit_amount": "2",
 *     "contract_details": [ "Guarantor", "Reviewed Property" ],
 *     "property_preferences": ["New Homes","Auction"],
 *     "floor_size": "80 - 100",
 *     "floor_size_unit": "sq.m",
 *     "room_details": {
 *         "number_of_bathrooms": 1,
 *         "number_of_bedrooms": 1
 *     },
 *     "parking_details": ["Garage"],
 *     "flat_details" :{
 *          "property_purpose": "Purpose built",
 *          "floor": 15,
 *          "lift": true,
 *          "security": false,
 *     },
 *     "distance_from_underground": {
 *         "value": 1,
 *         "unit": "km"
 *      },
 *      "distance_from_schools": {
 *         "value": 200,
 *         "unit": "m"
 *      },
 *      "distance_from_high_street": {
 *         "value": 200,
 *         "unit": "m"
 *      },
 *      "distance_from_gym": {
 *          "value": 200,
 *          "unit": "m"
 *      },
 *     "outside_space": ["Garden"],
 *     "property_features": ["Park nearby","Shopping centers nearby"],
 *     "specific_property_features": ["Parking spot"],
 *     "credit_score_requirements": "Excellent",
 *     "looking_for": "I own a place",
 *     "moving_time": "This month"
 * }
 */

/**
 * @apiDefine CreateCriteria
 * @apiBody {String} area_of_interest
 * @apiBody {String} budgetFor
 * @apiBody {Object} asset_address
 * @apiBody {Number} asset_address.latitude
 * @apiBody {Number} asset_address.longitude
 * @apiBody {String} radius
 * @apiBody {String[]} property_type
 * @apiBody {String} deposit_amount
 * @apiBody {String[]} contract_details
 * @apiBody {String[]} property_class
 * @apiBody {String[]} parking_details
 * @apiBody {String[]} outside_space
 * @apiBody {String[]} property_features An array of property features.
 * @apiBody {Number} floor_size
 * @apiBody {String} floor_size_unit
 * @apiBody {Object} room_details
 * @apiBody {String} room_details.number_of_bathrooms
 * @apiBody {String} room_details.number_of_bedrooms
 * @apiBody {Object} flat_details
 * @apiBody {String} flat_details.property_purpose
 * @apiBody {String} flat_details.floor
 * @apiBody {String} flat_details.lift
 * @apiBody {String} flat_details.security
 * @apiBody {Object} distance_from_underground
 * @apiBody {String} distance_from_underground.value
 * @apiBody {String} distance_from_underground.unit
 * @apiBody {Object} distance_from_schools
 * @apiBody {String} distance_from_schools.value
 * @apiBody {String} distance_from_schools.unit
 * @apiBody {Object} distance_from_high_street
 * @apiBody {String} distance_from_high_street.value
 * @apiBody {String} distance_from_high_street.unit
 * @apiBody {Object} distance_from_gym
 * @apiBody {String} distance_from_gym.value
 * @apiBody {String} distance_from_gym.unit
 * @apiBody {String[]} specific_property_features An array of property Specific property features.
 * @apiBody {String} credit_score_requirements
 * @apiBody {String} budget
 * @apiBody {String} transaction_type_string
 * @apiBody {String[]} property_features An array of property features.
 * @apiBody {String} looking_for
 * @apiBody {String} moving_time
 *
 */
