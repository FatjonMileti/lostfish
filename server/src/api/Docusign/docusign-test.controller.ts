import { Router, Request, Response } from 'express';
import docusignService from './docusign.service';
import authorize from '../../middleware/authorize';
import Envelope from './schemas/envelope';
const router: Router = Router();
const jwtConfig = require('./jwtConfig.json');

export class DocusignController {
  public router = router;
  public docusignService = docusignService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.authenticate);
    this.router.post('/form', authorize(), this.sendForm);
    this.router.get('/consent', this.getConsent);
    this.router.get('/callback', this.redirectCallback);
    this.router.get('/success', this.successSign);
  }

  private authenticate = async (req: Request, res: Response) => {
    const token = await this.docusignService.getToken();

    res.send('token' + token);
  };

  /**
   * @api {post} /api/docusign/form Create ne wenvelope
   * @apiDescription Add a new envelope as draft
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/form
   *
   * @apiUse CreateDocusignForm
   * @apiUse CreateDocusignFormExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private sendForm = this.docusignService.sendEnvelope;

  private getConsent = async (req: Request, res: Response) => {
    const redirectUri = await docusignService.getConsent();
    res.redirect(redirectUri);
  };

  private redirectCallback = async (req: Request, res: Response) => {
    res.send('authorization granted');
  };

  private successSign = async (req: Request, res: Response) => {
    res.send('Success');
  };
}

/**
 * @apiDefine CreateDocusignFormExample
 * @apiExample {json} Example request body:
 *    {
 *     "tenant": "gikbjkjb3tl3ntlk4lk",
 *     "company": "Fsd"
 * }
 */

/**
 * @apiDefine CreateDocusignForm
 * @apiBody {String} tenant
 * @apiBody {String} company
 *
 */
