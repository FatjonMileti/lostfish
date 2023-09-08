import { Request, Response, Router } from 'express';
import docusignService from './services/docusign.service';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import validateId from '../../middleware/object-id.validator';
import docusignLocalService from './services/docusign.local.service';
import config from '../../config/index';
import abilityMiddleware from '../../middleware/ability.middleware';
import { CASLAction } from '../../casl/casl.interface';

const router: Router = Router();

export class DocusignController {
  public router = router;
  public docusignService = docusignService;
  public docusignLocalService = docusignLocalService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authorize(), this.getEnvelopeByUserFilter);
    this.router.get('/get-consent', this.getConsent);
    this.router.get('/callback', this.redirectCallback);
    this.router.get('/success', this.successSign);
    this.router.get(
      '/envelope',
      authorize(),
      paging({ sort: { status_date_time: -1 } }),
      abilityMiddleware(CASLAction.Read, 'SignGenerator'),
      this.getEnvelopeList
    );
    this.router.post(
      '/create-envelope',
      authorize(),
      abilityMiddleware(CASLAction.Create, 'SignGenerator'),
      this.createEnvelope
    );
    this.router.post('/create-transaction-envelope', authorize(), this.createTransactionAgreement);
    this.router.get('/envelope/:id/download', this.downloadDocument);
    this.router.get('/envelope/:id', authorize(), validateId, this.getEnvelopeById);
  }

  /**
   * @api {post} /api/docusign/create-envelope Create new envelope
   * @apiDescription Add a new envelope as draft
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/create-envelope
   *
   * @apiUse CreateDocusignForm
   * @apiUse CreateDocusignFormExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createEnvelope = this.docusignService.createEnvelope;

  /**
   * @api {post} /api/docusign/create-transaction-envelope Create new transaction agreement
   * @apiDescription Create new transaction agreement
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/create-transaction-envelope
   *
   * @apiUse CreateDocusignForm
   * @apiUse CreateDocusignFormExample
   * @apiPermission admin
   * @apiUse bearer
   */
  private createTransactionAgreement = this.docusignService.createLostfishTransactionAgreement;

  /**
   * @api {get} /api/docusign/:id Update url
   * @apiDescription Get envelope details
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/:id
   *
   * @apiUse bearer
   */
  private getEnvelopeById = this.docusignLocalService.getEnvelopeById;

  /**
   * @api {get} /api/docusign Get updated envelope details by filters
   * @apiDescription Get envelope details
   * @apiGroup Docusign
   * @apiQuery {string} document_type
   * @apiSampleRequest /api/docusign
   *
   * @apiUse bearer
   */
  private getEnvelopeByUserFilter = this.docusignLocalService.getEnvelopeByUserFilter;

  /**
   * @api {get} /api/docusign/:id/download Download signed document
   * @apiDescription Download document after is signed
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/:id/download
   *
   * @apiUse bearer
   */
  private downloadDocument = this.docusignLocalService.downloadDocument;

  /**
   * @api {get} /api/docusign/get-consent Generate consent
   * @apiDescription Generate an application consent url
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/get-consent
   *
   * @apiUse bearer
   */
  private getConsent = this.docusignLocalService.generateConsentUrl;

  /**
   * This is used by docusign to redirect after consent
   */
  private redirectCallback = async (req: Request, res: Response) => {
    res.redirect(config.frontendUrl);
  };

  /**
   * This is used by docusign to redirect signin with success
   */
  private successSign = this.docusignLocalService.successSignRedirect;

  /**
   * This is used us to fetch all envelopes
   * TODO will we create a script to sync them from docusign?
   */
  private getEnvelopeList = this.docusignLocalService.getEnvelopeList;
}

/**
 * @apiDefine CreateDocusignFormExample
 * @apiExample {json} Example request body:
 *    {
 *     "tenant": "gikbjkjb3tl3ntlk4lk",
 *     "property_id": "12344"
 * }
 */

/**
 * @apiDefine CreateDocusignForm
 * @apiBody {String} tenant
 * @apiBody {String} property_id
 */
