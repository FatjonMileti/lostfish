import FilesCollection from '../../../data/files.collection';
import path from 'path';
import fs from 'fs';
import { FileService } from '../file.interface';
import config from '../../../config/index';
import process from 'process';

export default class LocalFileService implements FileService {
  async uploadFile(file: any): Promise<any> {
    return {
      key: file.filename,
      mimetype: file.mimetype,
      originalname: file.originalname,
      link: `${config.api_url}/api/file/${file.filename}`,
      isNew: true
    };
  }

  async uploadFiles(files: any[]): Promise<any[]> {
    await FilesCollection.insertMany(files);
    return files.map((file: any) => {
      return this.uploadFile(file);
    });
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    const filePathString: string = 'uploads/';

    const rootDir = process.cwd();
    const filePath = path.resolve(rootDir, filePathString, fileUrl);

    try {
      return await new Promise((resolve, reject) => {
        fs.unlink(filePath, async (error: any) => {
          if (error) {
            reject(false);
          } else {
            await FilesCollection.deleteOne({ filename: fileUrl });
            resolve(true);
          }
        });
      });
    } catch (error) {
      return false;
    }
  }

  async getFile(fileUrl: string): Promise<any> {
    const imagePath = path.resolve(process.cwd(), 'uploads', fileUrl);

    try {
      return fs.readFileSync(imagePath);
    } catch (error: any) {
      return null;
    }
  }
}
