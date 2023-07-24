import multer, { Multer } from 'multer';
import * as process from 'process';
const fs = require('fs');
const path = require('path');

export default class LocalUploadService {
  private static instance: LocalUploadService;
  private uploader!: Multer;

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
      const image = fs.readFileSync(imagePath);
      return image;
    } catch (error: any) {
      return null;
    }
  }
}
