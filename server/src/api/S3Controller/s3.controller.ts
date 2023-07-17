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
  }

  /**
   * @api {get} /api/s3/:filename Get filename
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
}
