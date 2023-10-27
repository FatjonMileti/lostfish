import { Request, Response, Router } from 'express';
import { MatchDocument, MatchingType } from './match.interface';
import MatchService from './match.service';
import authorize from '../../middleware/authorize';
import paging, { IPagingOptions } from '../../middleware/paging';
import { IMatchQueryParams } from './match.schema';
import { Role } from '../User/user.interface';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { generateLinksForMatchesImages } from './match.helper';
import assetService from '../Property/services/property.service';
import { LogAction, MatchLog } from '../../data/logs';
import criteriaService from '../Criteria/services/criteria.service';
import chatService from '../Chat/chat.service';
import SuggestionService from '../Suggestions/suggestion.service';
import AssetSchema from '../Property/schemas/property.schema';
import CriteriaSchema from '../Criteria/schemas/criteria.schema';
import validateId from '../../middleware/object-id.validator';
import propertyDetailService from '../Property/services/property-detail.service';
import { FilterQuery } from 'mongoose';

const router: Router = Router();

export class MatchController {
  private matchService: MatchService;
  private suggestionService: SuggestionService;
  public router = router;
  constructor(matchService: MatchService) {
    this.matchService = matchService;
    this.suggestionService = new SuggestionService(AssetSchema, CriteriaSchema);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    router.get('/', authorize(), paging({ sort: { created_at: -1 } }), this.getAllMatches);
    router.get('/property', authorize(), paging({ sort: { created_at: -1 } }), this.getAllPropertyMatches);

    router.get('/count', authorize(), this.countMatches);
    router.post('/tenants', authorize(), this.likeTenant);
    router.post('/properties', authorize(), this.likeProperty);
    router.get('/:id', authorize(), validateId, this.getMatchById);
    router.post('/tenant', authorize(), this.createMatchProperty);
    router.post('/property', authorize(), this.createMatchTenant);
    router.put('/:id', authorize(), validateId, this.updateMatch);
    router.delete('/:id', authorize(), validateId, this.deleteMatch);
  }

  private countMatches = async (req: Request, res: Response) => {
    const { matched } = req.query;

    try {
      const query: FilterQuery<MatchDocument> = {};

      query.created_by = res.locals.user_id;

      if (matched === 'false') {
        query.matched = false;
      }

      if (matched === 'true') {
        query.matched = true;
      }

      const count = await this.matchService.countMatches(query);
      return res.status(200).json({ number: count });
    } catch (err) {
      return res.status(500).json({ error: 'Unable to count matches' });
    }
  };

  private likeTenant = async (req: Request, res: Response) => {
    try {
      const matchData: Partial<MatchDocument> = req.body;
      const tenantId = matchData.tenant;
      const propertyId = matchData.property;

      const type = res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY;

      const match = await this.matchService.createMatch({
        property: propertyId,
        tenant: tenantId,
        chosen: true,
        type,
        landlord: res.locals.user_id,
        created_by: res.locals.user_id
      });

      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Create, info: matchData });

      return res.status(201).json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create a match.' });
    }
  };

  private likeProperty = async (req: Request, res: Response) => {
    try {
      const matchData: Partial<MatchDocument> = req.body;
      const propertyId = matchData.property;

      const property = await assetService.findById(propertyId as string);

      if (!property) {
        throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
      }

      const type = res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY;

      const match = await this.matchService.createMatch({
        chosen: true,
        landlord: property.created_by.toString(),
        property: property.id,
        type,
        tenant: res.locals.user_id,
        created_by: res.locals.user_id
      });

      await propertyDetailService.findAndIncrementById(
        property._id,
        matchData.chosen ? { matches: 1 } : { starred: 1 }
      );

      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Create, info: matchData });
      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Create, info: matchData });
      return res.status(201).json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create a match.' });
    }
  };

  private dislikeTenant = async (req: Request, res: Response) => {
    try {
    } catch (err) {
      throw err;
    }
  };

  /**
   * @api {post} /api/match/tenant Create a new match (as Landlord)
   * @apiDescription Create a new match (Landlord)
   * @apiGroup Matches
   * @apiSampleRequest /api/match/tenant
   * @apiBody {Boolean} [chosen=false] Whether the match is chosen
   * @apiBody {Boolean} [starred=false] Whether the match is starred
   * @apiBody {String} tenant Tenant Id
   * @apiBody {String} property Property Id
   * @apiUse CreateMatchLandlord
   * @apiSuccess {Object} match Created match object
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "_id": "6145f7433c2f33aabc9de4aa",
   *       "tenant": "6145f7433c2f33aabc9de4bb",
   *       "chosen": false,
   *       "starred": false,
   *       "type": "Property",
   *       "property": "6145f7433c2f33aabc9de4cc",
   *       "edited_by": "6145f7433c2f33aabc9de4dd",
   *       "created_by": "6145f7433c2f33aabc9de4ee",
   *       "created_at": "2021-09-18T12:34:56.789Z",
   *       "updated_at": "2021-09-18T12:34:56.789Z"
   *     }
   * @apiUse bearer
   */

  private createMatchProperty = async (req: Request, res: Response) => {
    try {
      const matchData: Partial<MatchDocument> = req.body;

      const type = res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY;

      const match = await this.matchService.createMatch({
        ...matchData,
        type,
        landlord: res.locals.user_id,
        created_by: res.locals.user_id
      });

      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Create, info: matchData });

      return res.status(201).json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create a match.' });
    }
  };

  /**
   * @api {post} /api/match/property Create a new match ( as Tenant)
   * @apiDescription Create a new match (Tenant)
   * @apiGroup Matches
   * @apiSampleRequest /api/match/property
   * @apiBody {Boolean} [chosen=false] Whether the match is chosen
   * @apiBody {Boolean} [starred=false] Whether the match is starred
   * @apiBody {String} property Property Id
   * @apiUse CreateMatchTenant
   * @apiSuccess {Object} match Created match object
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "_id": "6145f7433c2f33aabc9de4aa",
   *       "tenant": "6145f7433c2f33aabc9de4bb",
   *       "chosen": false,
   *       "starred": false,
   *       "type": "Property",
   *       "property": "6145f7433c2f33aabc9de4cc",
   *       "edited_by": "6145f7433c2f33aabc9de4dd",
   *       "created_by": "6145f7433c2f33aabc9de4ee",
   *       "created_at": "2021-09-18T12:34:56.789Z",
   *       "updated_at": "2021-09-18T12:34:56.789Z"
   *     }
   * @apiUse bearer
   */

  private createMatchTenant = async (req: Request, res: Response) => {
    try {
      const matchData: Partial<MatchDocument> = req.body;

      const property = await assetService.findById(matchData.property as string);

      if (!property) {
        throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
      }
      const type = res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY;

      const match = await this.matchService.createMatch({
        ...matchData,
        landlord: property.created_by.toString(),
        type,
        tenant: res.locals.user_id,
        created_by: res.locals.user_id
      });
      await propertyDetailService.findAndIncrementById(
        property._id,
        matchData.chosen ? { matches: 1 } : { starred: 1 }
      );
      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Create, info: matchData });
      return res.status(201).json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create a match.' });
    }
  };

  /**
   * @api {get} /api/match Get all matches
   * @apiDescription Get all matches
   * @apiGroup Matches
   * @apiSampleRequest /api/match
   * @apiUse bearer
   * @apiSuccess {Object[]} matches List of match objects
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "_id": "6145f7433c2f33aabc9de4aa",
   *         "tenant": "6145f7433c2f33aabc9de4bb",
   *         "chosen": false,
   *         "starred": false,
   *         "type": "type1",
   *         "property": "6145f7433c2f33aabc9de4cc",
   *         "edited_by": "6145f7433c2f33aabc9de4dd",
   *         "created_by": "6145f7433c2f33aabc9de4ee",
   *         "created_at": "2021-09-18T12:34:56.789Z",
   *         "updated_at": "2021-09-18T12:34:56.789Z"
   *       },
   *       // Other match objects...
   *     ]
   * @apiQuery {string} [starred] Starred
   * @apiQuery {string} [chosen] Choosed
   * @apiPermission authorize
   * @apiUse bearer
   * @apiUse paging
   */
  private getAllMatches = async (req: Request, res: Response) => {
    const { starred, chosen, propertyId } = req.query;

    const query: IMatchQueryParams = {};
    if ([Role.Landlord, Role.Client].includes(res.locals.role)) {
      query.created_by = res.locals.user_id;
      query.type = res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY;
    }

    if (starred) {
      query.starred = starred === 'true';
    }

    if (chosen) {
      query.chosen = chosen === 'true';
    }

    if (propertyId) {
      query.property = <string>propertyId;
    }

    try {
      const matches = await this.matchService.getAllMatches(
        query,
        res.locals.paging_options as IPagingOptions
      );

      matches.docs = generateLinksForMatchesImages(matches.docs);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < matches.docs.length; i++) {
        const currentMatch = matches.docs[i];

        matches.docs[i].unread_messages = await chatService.getMessagesBetweenUsers(
          currentMatch.landlord._id.toString(),
          currentMatch.tenant._id.toString(),
          res.locals.user_id as string,
          matches.docs[i].property._id
        );
        matches.docs[i].criteria = await criteriaService.findByUserId(currentMatch.tenant._id);
        matches.docs[i].suggestion_id = i;
        const percentage = this.suggestionService.calculateSimilarity(
          matches.docs[i].criteria,
          matches.docs[i].property
        );
        matches.docs[i].property.percentage = parseInt(percentage.toFixed(0), 10);
        matches.docs[i].matchId = currentMatch._id;
      }
      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Read, info: query });
      return res.status(200).json(matches);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Unable to fetch matches.' });
    }
  };

  /**
   * @api {get} /api/match/property Get all matches for property
   * @apiDescription Get all matches for property
   * @apiGroup Matches
   * @apiSampleRequest /api/match/property
   * @apiUse bearer
   * @apiSuccess {Object[]} matches List of match objects
   * @apiQuery {string} [starred] Starred
   * @apiQuery {string} [chosen] Choosed
   * @apiPermission authorize
   * @apiUse bearer
   * @apiUse paging
   */
  private getAllPropertyMatches = async (req: Request, res: Response) => {
    const { starred, chosen, propertyId } = req.query;

    const query: any = {
      created_by: { $ne: res.locals.user_id }
    };

    if (starred) {
      query.starred = starred === 'true';
    }

    if (chosen) {
      query.chosen = chosen === 'true';
    }

    if (propertyId) {
      query.property = <string>propertyId;
    }

    try {
      const matches = await this.matchService.getAllMatches(
        query,
        res.locals.paging_options as IPagingOptions
      );

      matches.docs = generateLinksForMatchesImages(matches.docs);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < matches.docs.length; i++) {
        const currentMatch = matches.docs[i];

        matches.docs[i].unread_messages = await chatService.getMessagesBetweenUsers(
          currentMatch.landlord._id.toString(),
          currentMatch.tenant._id.toString(),
          res.locals.user_id as string,
          matches.docs[i].property._id
        );
        matches.docs[i].criteria = await criteriaService.findByUserId(currentMatch.tenant._id);
        matches.docs[i].suggestion_id = i;
        const percentage = this.suggestionService.calculateSimilarity(
          matches.docs[i].criteria,
          matches.docs[i].property
        );
        matches.docs[i].property.percentage = parseInt(percentage.toFixed(0), 10);
        matches.docs[i].matchId = currentMatch._id;
      }
      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Read, info: query });
      return res.status(200).json(matches);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Unable to fetch matches.' });
    }
  };

  /**
   * @api {get} /api/match/:id Get a single match by ID
   * @apiDescription Get a single match by ID
   * @apiGroup Matches
   * @apiSampleRequest /api/match/:id
   * @apiUse bearer
   * @apiSuccess {Object} match Match object
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "6145f7433c2f33aabc9de4aa",
   *       "tenant": "6145f7433c2f33aabc9de4bb",
   *       "chosen": false,
   *       "starred": false,
   *       "type": "Property",
   *       "property": "6145f7433c2f33aabc9de4cc",
   *       "edited_by": "6145f7433c2f33aabc9de4dd",
   *       "created_by": "6145f7433c2f33aabc9de4ee",
   *       "created_at": "2021-09-18T12:34:56.789Z",
   *       "updated_at": "2021-09-18T12:34:56.789Z"
   *     }
   * @apiUse MatchNotFoundError
   */
  private getMatchById = async (req: Request, res: Response) => {
    const matchId: string = req.params.id;

    const query: IMatchQueryParams = {
      type: res.locals.role === Role.Landlord ? MatchingType.USER : MatchingType.PROPERTY,
      _id: matchId,
      created_by: res.locals.user_id
    };
    try {
      const match = await this.matchService.getMatchByQuery(query);
      if (!match) {
        return res.status(404).json({ error: 'Match not found.' });
      }
      await MatchLog.create({ user: res.locals.user_id, action: LogAction.Read, ref: matchId, info: match });
      return res.status(200).json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch the match.' });
    }
  };

  /**
   * @api {put} /api/match/:id Update match
   * @apiDescription Update match by id
   * @apiGroup Matches
   * @apiSampleRequest /api/match/:id
   * @apiUse bearer
   * @apiBody {Boolean} [chosen=false] Whether the match is chosen
   * @apiBody {Boolean} [starred=false] Whether the match is starred
   * @apiBody {String} type Matching type (enum: 'Property', 'User')
   * @apiBody {String} property Property ID associated with the match
   * @apiBody {String} tenant TenantID associated with the match
   * @apiSuccess {Object} match Created match object
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 Updated
   *     {
   *       "_id": "6145f7433c2f33aabc9de4aa",
   *       "tenant": "6145f7433c2f33aabc9de4bb",
   *       "chosen": false,
   *       "starred": false,
   *       "type": "type1",
   *       "property": "6145f7433c2f33aabc9de4cc",
   *       "edited_by": "6145f7433c2f33aabc9de4dd",
   *       "created_by": "6145f7433c2f33aabc9de4ee",
   *       "created_at": "2021-09-18T12:34:56.789Z",
   *       "updated_at": "2021-09-18T12:34:56.789Z"
   *     }
   */
  private updateMatch = async (req: Request, res: Response) => {
    const matchId: string = req.params.id;
    const matchData: Partial<MatchDocument> = req.body;
    console.log({ matchData });
    const newData = { ...matchData, edited_at: new Date(), edited_by: res.locals.user_id };
    try {
      const existingMatch = await this.matchService.findMatchById(matchId);
      if (!existingMatch) {
        return res.status(404).json({ error: 'Match not found.' });
      }

      const updatedMatch = await this.matchService.updateMatch(matchId, newData);
      let data: any = {};
      if (existingMatch.chosen && !updatedMatch?.chosen) {
        data = { matches: -1 };
      } else if (!existingMatch.chosen && updatedMatch?.chosen) {
        data = { matches: +1 };
      } else if (existingMatch.starred && !updatedMatch?.starred) {
        data = { ...data, starred: -1 };
      } else if (!existingMatch.starred && updatedMatch?.starred) {
        data = { ...data, starred: +1 };
      }

      await propertyDetailService.findAndIncrementById(<string>existingMatch.property, { ...data });

      if (updatedMatch && !updatedMatch.chosen && !updatedMatch.starred) {
        const deletedMatch = await this.matchService.deleteMatch(matchId);
        return res.status(204).send(deletedMatch);
      }

      await MatchLog.create({
        user: res.locals.user_id,
        action: LogAction.Update,
        ref: matchId,
        info: matchData
      });
      return res.status(200).json(updatedMatch);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to update the match.' });
    }
  };

  /**
   * @api {delete} /api/match/:id Delete a match by ID
   * @apiDescription Delete a match by ID
   * @apiGroup Matches
   * @apiSampleRequest /api/match/:id
   * @apiParam {String} id Match ID
   * @apiSuccess {Object} match Deleted match object
   * @apiUse bearer
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "6145f7433c2f33aabc9de4aa",
   *       "tenant": "6145f7433c2f33aabc9de4bb",
   *       "chosen": false,
   *       "starred": false,
   *       "type": "Property",
   *       "property": "6145f7433c2f33aabc9de4cc",
   *       "edited_by": "6145f7433c2f33aabc9de4dd",
   *       "created_by": "6145f7433c2f33aabc9de4ee"
   *     }
   * @apiError MatchDeleteError Unable to delete the match.
   * @apiErrorExample MatchDeleteError:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": "Unable to delete the match."
   *     }
   */
  private deleteMatch = async (req: Request, res: Response) => {
    const matchId: string = req.params.id;
    try {
      const deletedMatch = await this.matchService.deleteMatch(matchId);
      if (!deletedMatch) {
        return res.status(404).json({ error: 'Match not found.' });
      }
      await MatchLog.create({
        user: res.locals.user_id,
        action: LogAction.Delete,
        ref: matchId,
        info: deletedMatch
      });
      return res.status(200).json(deletedMatch);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to delete the match.' });
    }
  };
}

/**
 * @apiDefine MatchNotFoundError
 * @apiError MatchNotFound The match with the given ID was not found.
 * @apiErrorExample MatchNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Match not found."
 *     }
 */

/**
 * @apiDefine CreateMatchLandlord
 * @apiExample {json} Example request body:
 *    {
 *       "chosen": false,
 *       "starred": false,
 *       "tenant": "6145f7433c2f33aabc9de4cc"
 *    }
 */

/**
 * @apiDefine CreateMatchTenant
 * @apiExample {json} Example request body:
 *    {
 *       "chosen": false,
 *       "starred": false,
 *       "property": "6145f7433c2f33aabc9de4cc"
 *    }
 */
