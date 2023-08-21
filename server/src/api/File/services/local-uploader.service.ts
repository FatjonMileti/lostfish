import multer, { Multer } from 'multer';
import * as process from 'process';
import internalFileService from '../services/file.service';

const fs = require('fs');
const path = require('path');

export default class LocalUploadService {
  private static instance: LocalUploadService;
  private uploader!: Multer;
  private internalFileService = internalFileService;

  private constructor() {}

  static getInstance(): LocalUploadService {
    if (!LocalUploadService.instance) {
      LocalUploadService.instance = new LocalUploadService();
    }
    return LocalUploadService.instance;
  }

  createLocalUploader(dest?: string): Multer {
    this.uploader = multer({
      dest: dest ? dest : 'uploads',
      limits: {
        fileSize: 10 * (1024 * 1024)
      }
    });
    return this.uploader;
  }

  getImage(id: string) {
    const imagePath = path.resolve(process.cwd(), 'uploads', id);

    try {
      return fs.readFileSync(imagePath);
    } catch (error: any) {
      return null;
    }
  }

  getFilePath(id: string) {
    return path.resolve(process.cwd(), 'uploads', id);
  }

  async deleteImage(img: string): Promise<any> {
    return this.internalFileService.removeFile(img);
  }
}
