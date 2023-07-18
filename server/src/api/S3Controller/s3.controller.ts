import { Router, Request, Response } from 'express';
const router: Router = Router();

import UploadService from '../../utils/image';
const uploadService = UploadService.getInstance();
export class S3Controller {
  public router = router;
  private uploadService = uploadService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:filename', this.getFile);
    this.router.get('/user-docs/:filename', this.getUserDocs);
    this.router.get('/property-images/:filename', this.getPropertyFiles);
  }

  /**
   * @api {get} /api/s3/:filename Get any file
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/s3/:filename
   *
   */
  protected getFile = async (request: Request, response: Response) => {
    const filename = request.params.filename;

    try {
      const url = (await this.uploadService.getImageFromS3(filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/s3/user-docs/:filename Get file of an user
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/s3/user-docs/:filename
   *
   */
  protected getUserDocs = async (request: Request, response: Response) => {
    const filename = request.params.filename;

    try {
      const url = (await this.uploadService.getImageFromS3('user-docs/' + filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/s3/property-images/:filename Get file for properties
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/s3/property-images/:filename
   *
   */
  protected getPropertyFiles = async (request: Request, response: Response) => {
    const filename = request.params.filename;

    try {
      const url = (await this.uploadService.getImageFromS3('property-images/' + filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
