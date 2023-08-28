import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import FilesCollection, { IFiles } from '../../data/files.collection';
import createError from 'http-errors';
import httpStatus from 'http-status';
import config from '../../config';
import { fileService } from '../index';
const router: Router = Router();

export class FileController {
  public router = router;
  private fileService = fileService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:filename', this.getFile);
    this.router.get('/pdf/:fileId', this.getFilePdf);
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
        const protectedUrl = (await this.fileService.getFile(filename)) as string;
        return response.redirect(protectedUrl);
      }

      const addedFile: IFiles | null = await FilesCollection.findOne({
        $or: [{ filename }, { key: filename }]
      }).lean();

      if (!addedFile) {
        throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
      }
      const file = await this.fileService.getFile(filename);
      response.setHeader('Content-Type', addedFile.mimetype);

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
        const protectedUrl = (await this.fileService.getFile(fileId)) as string;
        return response.redirect(protectedUrl);
      }

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName ? fileName : 'document.pdf'}`
      );

      const stream = fs.createReadStream(path.resolve(process.cwd(), 'uploads', fileId));
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
        const protectedUrl = (await this.fileService.getFile(`user-docs/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.fileService.getFile(filename);
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
        const protectedUrl = (await this.fileService.getFile(`property-images/${filename}`)) as string;
        return response.redirect(protectedUrl);
      }

      const file = this.fileService.getFile(filename);

      return response.end(file, 'binary');
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
