import { Request, Response, Router } from 'express';
import authorize from '../../middleware/authorize';
import paging, { IPagingOptions } from '../../middleware/paging';

import SuggestionService from './suggestion.service';
import httpStatus from 'http-status';

const router: Router = Router();

export class SuggestionController {
  private suggestionService: SuggestionService;
  public router = router;
  constructor(suggestionService: SuggestionService) {
    this.suggestionService = suggestionService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    router.get('/asset', authorize(), paging({ sort: { date: -1 } }), this.getPropertySuggestions);
    router.get('/tenant', authorize(), paging({ sort: { date: -1 } }), this.getTenantsSuggestions);
  }

  /**
   * @api {get} /api/suggestion/asset Get all property suggestions
   * @apiDescription Get all property suggestions
   * @apiGroup Suggestion
   * @apiSampleRequest /api/suggestion/asset
   * @apiUse bearer
   * @apiPermission authorize
   * @apiUse paging
   */
  public getPropertySuggestions = async (req: Request, res: Response) => {
    const userId = res.locals.user_id as string;
    const paginateOptions = res.locals.paging_options as IPagingOptions;
    const { chosen } = req.query;

    const { response, success } = await this.suggestionService.getFilteredPropertiesByUser(
      paginateOptions,
      userId,
      chosen
    );

    if (success) {
      return res.send(response);
    }

    return res.status(httpStatus.BAD_REQUEST).send({ ...response });
  };

  /**
   * @api {get} /api/suggestion/tenant Get all tenants suggestions
   * @apiDescription Get all tenants suggestions
   * @apiGroup Suggestion
   * @apiSampleRequest /api/suggestion/tenant
   * @apiQuery {string} propertyId
   * @apiUse bearer
   * @apiPermission authorize
   * @apiUse paging
   */
  public getTenantsSuggestions = async (req: Request, res: Response) => {
    const userId = res.locals.user_id as string;
    const paginateOptions = res.locals.paging_options as IPagingOptions;
    const { propertyId, chosen } = req.query;
    const { response, success } = await this.suggestionService.getFilteredTenantsByUser(
      paginateOptions,
      userId,
      chosen
    );

    if (success) {
      return res.send(response);
    }

    return res.status(httpStatus.BAD_REQUEST).send({ ...response });
  };
}
