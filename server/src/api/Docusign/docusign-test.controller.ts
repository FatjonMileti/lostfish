import { Router, Request, Response } from 'express';
import docusignService from './services/docusign.service';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import Envelope, { IEnvelope } from './schemas/envelope';
import httpStatus from 'http-status';
import config from '../../config';
import createError from 'http-errors';
import { Role } from '../User/user.interface';
import userService from '../User/user.service';
import fs from 'fs';
import docusignLocalService from './services/docusign.local.service';
const router: Router = Router();

export class DocusignController {
  public router = router;
  public docusignService = docusignService;
  public docusignLocalService = docusignLocalService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/form', authorize(), this.sendForm);
    this.router.get('/consent', this.getConsent);
    this.router.get('/callback', this.redirectCallback);
    this.router.get('/success', this.successSign);
    this.router.get('/:id/update-url', authorize(), this.generateNewSignUrls);
    this.router.patch('/:id/generate-url', authorize(), this.updateUrlForLoggedInUser);
    this.router.get(
      '/envelope',
      authorize(),
      paging({ sort: { status_date_time: -1 } }),
      this.getEnvelopeList
    );

    this.router.get('/envelope/:id/download', this.downloadDocument);
    this.router.get('/envelope/:id', authorize(), this.getEnvelopeById);
  }

  private getEnvelopeById = this.docusignLocalService.getEnvelopeById;

  private downloadDocument = async (req: Request, res: Response) => {
    try {
      const file = await this.docusignService.getSingleDocument(req.params.id, {});
      // Send the file as a download
      res.download(file, 'signed_document.pdf', (err) => {
        if (err) {
          console.error('Error sending the file:', err);
        } else {
          // Clean up the temporary file after it is sent
          fs.unlink(file, (error: any) => {
            if (error) {
              console.error('Error deleting the temporary file:', error);
            } else {
              console.log('Temporary file deleted.');
            }
          });
        }
      });
    } catch (error) {
      // Handle error response
      res.status(500).send('Error retrieving the signed document.');
    }
  };

  /**
   * @api {get} /api/docusign/:id/update-url Update url
   * @apiDescription UPdate urls
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/:id/update-url
   *
   * @apiUse bearer
   */
  private generateNewSignUrls = async (req: Request, res: Response) => {
    const envelope: IEnvelope = await this.docusignService.updateUrl(req, res);
    res.send(envelope);
  };

  /**
   * @api {patch} /api/docusign/:id/generate-url Update url
   * @apiDescription UPdate urls
   * @apiGroup Docusign
   * @apiSampleRequest /api/docusign/:id/generate-url
   *
   * @apiUse bearer
   */
  private updateUrlForLoggedInUser = this.docusignService.updateUrlForLoggedInUser;
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

  /*http://localhost:3000/api/docusign/success?userId=64b6979619963c3c1bbbda9f&userType=Tenant&envelopeId=2a573eba-f8ba-4663-82d6-c33f9134e476&event=signing_complete*/
  private successSign = async (req: Request, res: Response) => {
    const { userId, userType, envelopeId, event } = req.query;
    try {
      if (userId) {
        const user = await userService.findOne({ _id: userId });
        if (!user) {
          throw createError(httpStatus.NOT_FOUND, { message: 'user_not_found' });
        }
      }
      if (event && event === 'signing_complete') {
        const existingEnvelope = await Envelope.findOne({ envelope_id: envelopeId });
        if (!existingEnvelope) {
          throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
        }
        if (userType && userType === Role.Client) {
          existingEnvelope.signed_by_tenant = true;
        }
        if (userType && userType === Role.Landlord) {
          existingEnvelope.signed_by_landlord = true;
        }
        await existingEnvelope.save();
        return res.redirect(`${config.front_end_url}?event=signing_complete`);
      }
      if (event && event === 'ttl_expired') {
        return res.redirect(`${config.front_end_url}/agreement?event=link_exipired`);
      }
      res.redirect(`${config.front_end_url}`);
    } catch (error: any) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'error ' });
    }
  };

  private getEnvelopeList = async (req: Request, res: Response) => {
    const query: any = {
      $or: [{ land_lord: { $eq: res.locals.user_id } }, { tenant: { $eq: res.locals.user_id } }]
    };

    const response = await Envelope.paginate(query, {
      ...res.locals.paging_options,
      populate: [
        { path: 'land_lord', select: ['first_name', 'last_name', '_id'] },
        { path: 'tenant', select: ['first_name', 'last_name', '_id'] }
      ]
    });
    return res.status(httpStatus.OK).send(response);
  };
}

/**
 * @apiDefine CreateDocusignFormExample
 * @apiExample {json} Example request body:
 *    {
 *     "tenant": "gikbjkjb3tl3ntlk4lk"
 * }
 */

/**
 * @apiDefine CreateDocusignForm
 * @apiBody {String} tenant
 *
 */
