import { Router } from 'express';
import docusignService from './docusign.service';
const router: Router = Router();

export class DocusignControllerd {
  public router = router;
  public docusignService = docusignService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/auth', this.getConsent);
    this.router.post('/', this.authenticate);
  }

  /**
   * @api {get} /api/condition Get
   * @apiDescription Get condition
   * @apiGroup Condition
   * @apiSampleRequest /api/condition
   *
   */
  private getConsent = this.docusignService.getConsent;

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
  private authenticate = this.docusignService.authenticateDocusign;
}
