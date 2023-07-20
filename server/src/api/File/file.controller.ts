import { Router, Request, Response } from 'express';
const router: Router = Router();

import UploadService from './services/s3-upload.service';
import LocalUploaderService from './services/local-uploader.service';
import config from '../../config';
const uploadService = UploadService.getInstance();
const localUploaderService = LocalUploaderService.getInstance();
export class FileController {
  public router = router;
  private uploadService = config.isProduction ? uploadService : localUploaderService;
  private isDevelopment = config.isDevelopment;
  private isProduction = config.isProduction;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:filename', this.getFile);
    this.router.get('/user-docs/:filename', this.getUserDocs);
    this.router.get('/property-images/:filename', this.getPropertyFiles);
  }

  /**
   * @api {get} /api/file/:filename Get any file
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/file/:filename
   *
   */
  protected getFile = async (request: Request, response: Response) => {
    const filename = request.params.filename;
    if (this.isDevelopment) {
      const url = this.uploadService.getImage(filename);
      return response.end(url, 'binary');
    }

    try {
      const url = (await this.uploadService.getImage(filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/file/user-docs/:filename Get file of an user
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/file/user-docs/:filename
   *
   */
  protected getUserDocs = async (request: Request, response: Response) => {
    const filename = request.params.filename;
    if (this.isDevelopment) {
      const url = this.uploadService.getImage(filename, 'user-docs/');
      console.log({ url });
      return response.end(url, 'binary');
    }
    try {
      const url = (await this.uploadService.getImage('user-docs/' + filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/file/property-images/:filename Get file for properties
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/file/property-images/:filename
   *
   */
  protected getPropertyFiles = async (request: Request, response: Response) => {
    const filename = request.params.filename;
    if (this.isDevelopment) {
      const url = this.uploadService.getImage(filename, 'user-docs/');

      return response.end(url, 'binary');
    }
    try {
      const url = (await this.uploadService.getImage('property-images/' + filename)) as string;
      response.redirect(url);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
