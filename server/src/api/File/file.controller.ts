import { Router, Request, Response } from 'express';
import FilesCollection, { IFiles } from '../../data/files.collection';
import createError from 'http-errors';
import httpStatus from 'http-status';
import config from '../../config/index';
import { FileService } from './file.interface';
const router: Router = Router();

export class FileController {
  public router = router;
  private fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:filename', this.getFile);
  }

  /**
   * @api {get} /api/file/:filename Get any file
   * @apiDescription Get file by fileid
   * @apiGroup File
   * @apiSampleRequest /api/file/:filename
   *
   */
  protected getFile = async (request: Request, response: Response) => {
    const filename = request.params.filename;

    const addedFile: IFiles | null = await FilesCollection.findOne({
      $or: [{ filename }, { key: filename }]
    }).lean();

    if (!addedFile) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

    response.setHeader('Content-Type', addedFile.mimetype);

    if (config.useAzureStorage) {
      const fileContent = await this.fileService.getFile(filename);
      return response.send(fileContent);
    }

    const file = await this.fileService.getFile(filename);
    response.end(file, 'binary');
  };
}
