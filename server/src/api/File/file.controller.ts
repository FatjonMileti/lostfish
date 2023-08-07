import { Router, Request, Response } from 'express';
const router: Router = Router();
import S3UploadService from './services/s3-file.service';
import LocalUploaderService from './services/local-uploader.service';
import config from '../../config';
import assetService from '../Asset/services/asset.service';
const s3UploadService = S3UploadService.getInstance();
const localUploaderService = LocalUploaderService.getInstance();
import fs from 'fs';
export class FileController {
  public router = router;
  private fileService = config.uses3Bucket ? s3UploadService : localUploaderService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:filename', this.getFile);
    this.router.get('/pdf/:fileId', this.getFilePdf);
    this.router.get('/user-docs/:filename', this.getUserDocs);
    this.router.get('/property-images/:filename', this.getPropertyFiles);
    this.router.delete('/', this.deleteFile);
  }

  protected deleteFile = async (request: Request, response: Response) => {
    const { propertyId, documentId, fileId } = request.query;
    if (config.uses3Bucket) {
      console.log('using s3');
    }

    if (propertyId) {
      if (typeof fileId === 'string') {
        const parts = fileId && fileId.split('/');
        const id = parts[parts.length - 1];
        const property = await assetService.findById(propertyId as string);
        property.property_images = property.property_images.filter((item: any) => item.key !== id);
        const fileResponse = await this.fileService.deleteImage(id, propertyId as string);
        if (fileResponse) {
          await property.save();
        } else {
          return response.send({ success: fileResponse, message: 'file_not_deleted' });
        }

        return response.send({ success: fileResponse, message: 'deleted_with_success' });
      }
    }

    return response.send('ok');
  };

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
        const protectedUrl = (await this.fileService.getImage(filename)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.fileService.getImage(filename);
      return response.end(file, 'binary');
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/file/pdf/:fileId Download pdf file
   * @apiDescription Get file to s3
   * @apiGroup AWS
   * @apiSampleRequest /api/file/pdf/:fileId
   *
   */
  protected getFilePdf = async (request: Request, response: Response) => {
    const fileId = request.params.fileId;
    const fileName = request.query.fileName;
    try {
      if (config.uses3Bucket) {
        const protectedUrl = (await this.fileService.getImage(fileId)) as string;
        return response.redirect(protectedUrl);
      }

      // Set appropriate headers for the PDF response
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName ? fileName : 'document.pdf'}`
      );
      const file = this.fileService.getFilePath(fileId);
      // Stream the PDF file to the response
      const stream = fs.createReadStream(file);
      stream.pipe(response);
    } catch (error: any) {
      console.log(error);
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
        const protectedUrl = (await this.fileService.getImage(`user-docs/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.fileService.getImage(filename, 'user-docs/');
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
        const protectedUrl = (await this.fileService.getImage(`property-images/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.fileService.getImage(filename, 'user-docs/');

      return response.end(file, 'binary');
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
