import { Router, Request, Response } from 'express';
const router: Router = Router();
import S3UploadService from './services/s3-upload.service';
import LocalUploaderService from './services/local-uploader.service';
import config from '../../config';
const s3UploadService = S3UploadService.getInstance();
const localUploaderService = LocalUploaderService.getInstance();

export class FileController {
  public router = router;
  private uploadService = config.uses3Bucket ? s3UploadService : localUploaderService;

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

    try {
      if (config.uses3Bucket) {
        const protectedUrl = (await this.uploadService.getImage(filename)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.uploadService.getImage(filename);
      return response.end(file, 'binary');
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

    try {
      if (config.uses3Bucket) {
        const protectedUrl = (await this.uploadService.getImage(`user-docs/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.uploadService.getImage(filename, 'user-docs/');
      return response.end(file, 'binary');
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

    try {
      if (config.uses3Bucket) {
        const protectedUrl = (await this.uploadService.getImage(`property-images/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.uploadService.getImage(filename, 'user-docs/');

      return response.end(file, 'binary');
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
