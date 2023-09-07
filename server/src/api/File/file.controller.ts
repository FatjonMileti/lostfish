import { Router, Request, Response } from 'express';
import FilesCollection, { IFiles } from '../../data/files.collection';
import createError from 'http-errors';
import httpStatus from 'http-status';
import config from '../../config/index';
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
      const addedFile: IFiles | null = await FilesCollection.findOne({
        $or: [{ filename }, { key: filename }]
      }).lean();

      if (!addedFile) {
        throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
      }

      if (config.useAzureStorage) {
        const fileContent = await this.fileService.getFile(filename);
        response.setHeader('Content-Type', addedFile.mimetype);
        return response.send(fileContent);
      }
      const file = await this.fileService.getFile(filename);
      response.setHeader('Content-Type', addedFile.mimetype);

      return response.end(file, 'binary');
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
