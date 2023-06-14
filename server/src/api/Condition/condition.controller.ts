import { Router } from 'express';
import conditionService from './services/condition.service';
const router: Router = Router();

export class ConditionController {
  public router = router;
  public conditionService = conditionService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.findAll);
    this.router.post('/', this.createCondition);
  }

  /**
   * @api {get} /api/condition Get
   * @apiDescription Get condition
   * @apiGroup Condition
   * @apiSampleRequest /api/condition
   *
   */
  private findAll = this.conditionService.findAll;

  /**
   * @api {post} /api/condition Post
   * @apiDescription Add a new condition
   * @apiGroup Condition
   * @apiSampleRequest /api/condition
   *
   * @apiBody {string} name
   * @apiBody {string} label
   * @apiBody {string} description
   * @apiBody {string} fieldset
   * @apiBody {string} type_string
   * @apiBody {boolean} required
   *
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private createCondition = this.conditionService.createCondition;
}
