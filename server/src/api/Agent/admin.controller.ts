import { Request, Response, Router } from 'express';
import authorize from '../../middleware/authorize';
import paging, { IPagingOptions } from '../../middleware/paging';
import AdminService from './admin.service';
import { getFilters } from './helpers/filters';

const router: Router = Router();

export class AdminController {
  private adminService: AdminService;
  public router = router;
  constructor(adminService: AdminService) {
    this.adminService = adminService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    router.get('/session', authorize(), paging({ sort: { date: -1 } }), this.getAllSessions);
    router.get('/property', authorize(), paging({ sort: { date: -1 } }), this.getAllPropertyInteractions);
    router.get('/:id', authorize(), this.getMatchById);
  }

  /**
   * @api {get} /api/admin/session Get all sessions
   * @apiDescription Get all matches
   * @apiGroup Admin
   * @apiSampleRequest /api/admin/session
   * @apiUse bearer
   * @apiPermission authorize
   * @apiUse paging
   */
  private getAllSessions = async (req: Request, res: Response) => {
    const { query } = getFilters(req);

    try {
      const sessions = await this.adminService.getAllSessions(
        query,
        res.locals.paging_options as IPagingOptions
      );

      return res.status(200).json(sessions);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch sessions.' });
    }
  };

  /**
   * @api {get} /api/admin/property Get all property interactions
   * @apiDescription Get all property interactions
   * @apiGroup Admin
   * @apiSampleRequest /api/admin/property
   * @apiUse bearer
   * @apiPermission authorize
   * @apiUse paging
   */
  private getAllPropertyInteractions = async (req: Request, res: Response) => {
    const { query } = getFilters(req);

    try {
      const sessions = await this.adminService.getAllPropertyLogsILogs(
        query,
        res.locals.paging_options as IPagingOptions
      );

      return res.status(200).json(sessions);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch sessions.' });
    }
  };

  /**
   * @api {get} /api/match/:id Get a single match by ID
   * @apiDescription Get a single match by ID
   * @apiGroup Matches
   * @apiSampleRequest /api/match/:id
   * @apiUse bearer
   * @apiUse MatchNotFoundError
   */
  private getMatchById = async (req: Request, res: Response) => {
    const logId: string = req.params.id;

    const query: any = {
      _id: logId
    };
    try {
      const session = await this.adminService.getSessionByQuery(query);
      if (!session) {
        return res.status(404).json({ error: 'Sesion not found.' });
      }
      return res.status(200).json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch the match.' });
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
