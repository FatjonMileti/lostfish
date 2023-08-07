import { Router, Request, Response } from 'express';
const router: Router = Router();
import config from '../../config';
import S3UploadService from '../File/services/s3-file.service';
import LocalUploadService from '../File/services/local-uploader.service';
import internalFileService from '../File/services/file.service';
import authorize from '../../middleware/authorize';
import { filesMapper } from './upload.helper';

/*Production services */
const publics3Uploader = S3UploadService.getInstance().createPublicUploader();
const protectedUploader = S3UploadService.getInstance().createPrivateUploader();

/* Local uploader service */
const localUploader = LocalUploadService.getInstance().createLocalUploader();

export class UploadController {
  public router = router;

  private publicUploader = config.uses3Bucket ? publics3Uploader : localUploader;
  private privateUploader = config.uses3Bucket ? protectedUploader : localUploader;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', authorize(), this.publicUploader.array('images'), this.uploadPropertyImages);
    this.router.post('/private-docs', authorize(), this.privateUploader.array('images'), this.uploadDocs);
  }

  /**
   * @api {post} /api/upload Upload images
   * @apiDescription Upload images
   *
   * @apiHeader {String} Content-Type multipart/form-data
   *
   * @apiParam {File[]} images Array of image files to upload.
   * @apiGroup Upload
   * @apiSampleRequest /api/upload
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  protected uploadPropertyImages = async (req: Request, res: Response) => {
    const files = req.files as any[];

    const updatedFiles = filesMapper(files);
    await internalFileService.createFiles(updatedFiles);
    res.status(200).send(updatedFiles);
  };

  /**
   * @api {post} /api/upload/private-docs Upload images
   * @apiDescription Upload images
   *
   * @apiHeader {String} Content-Type multipart/form-data
   *
   * @apiParam {File[]} images Array of image files to upload.
   * @apiGroup Upload
   * @apiSampleRequest /api/upload/private-docs
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  protected uploadDocs = async (req: Request, res: Response) => {
    const files = req.files as any[];
    const updatedFiles = filesMapper(files);
    await internalFileService.createFiles(updatedFiles);
    res.status(200).send(updatedFiles);
  };
}
