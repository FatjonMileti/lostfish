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

  createLocalUploader(): Multer {
    this.uploader = multer({ dest: 'uploads/asset-images' });
    return this.uploader;
  }

  getImage(id: string, folder?: string) {
    const imagePath = path.resolve(process.cwd(), 'uploads', folder ? folder : 'asset-images', id);

    try {
      return fs.readFileSync(imagePath);
    } catch (error: any) {
      return null;
    }
  }

  async deleteImage(img: string, propertyId: string = '', userId: string = ''): Promise<any> {
    if (propertyId) {
      return this.internalFileService.removeFile(img, propertyId);
    } else if (userId) {
      return this.internalFileService.removeFile(img, '', userId);
    }
  }
}
