import { Router, Request, Response } from 'express';
import criteriaService from './services/criteria.service';
import authorize from '../../middleware/authorize';

import validateId from '../../middleware/object-id.validator';
import CriteriaSchema from './schemas/criteria.schema';
import MatchSchema from '../Match/match.schema';
import { faker } from '@faker-js/faker';

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
    this.router.patch('/', authorize(), validateId, this.updateCriteria);
    this.router.get('/user-example-matches', authorize(), this.getMatchedUsers);
    this.router.get('/:id', authorize(), validateId, this.getById);
  }

  /**
   * @api {get} /api/criteria/user-example-matches Get users matches (Example)
   * @apiDescription Get user matches
   * @apiGroup Criteria
   * @apiSampleRequest /api/criteria/user-example-matches
   *
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getMatchedUsers = async (req: Request, res: Response) => {
    const matchesUsers: any = await CriteriaSchema.paginate(
      {
        created_by: { $ne: res.locals.user_id }
      },
      {
        ...res.locals.paging_options,
        populate: [
          {
            path: 'created_by',
            select: ['email', 'username', 'first_name', 'last_name', 'avatar']
          }
        ]
      }
    );

    const matches = await MatchSchema.find({ created_by: res.locals.user_id }).lean();

    matchesUsers.docs = matchesUsers.docs.map((item: any, index: number) => {
      const criteria = item.toObject();
      const matchTenant = matches.find(
        (match: any) => match.tenant.toString() === criteria?.created_by?._id.toString()
      );
      return {
        suggestion_id: index,
        criteria,
        chosen: matchTenant?.chosen ?? false,
        starred: matchTenant?.starred ?? false,
        matchId: matchTenant?._id ?? undefined,
        percentage: faker.number.int({ min: 30, max: 100 })
      };
    });

    res.status(200).send(matchesUsers);
  };

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
 *     "property_type": [ "Detached", "Semi-Detached" ],
 *     "deposit_amount": "2",
 *     "contract_details": [ "Guarantor", "Reviewed Property" ],
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
 *     "property_type": [ "Detached", "Semi-Detached" ],
 *     "deposit_amount": "2",
 *     "contract_details": [ "Guarantor", "Reviewed Property" ],
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
 * @apiBody {String} deposit_amount
 * @apiBody {String[]} contract_details
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
