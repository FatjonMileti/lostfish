import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import multer, { Multer } from 'multer';
import multerS3 from 'multer-s3';
import config from '../../../config';
import path from 'path';
import process from 'process';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

export default class S3FileService {
  private static instance: S3FileService;
  private uploader!: Multer;
  private s3service = s3;

  private constructor() {}

  static getInstance(): S3FileService {
    if (!S3FileService.instance) {
      S3FileService.instance = new S3FileService();
    }
    return S3FileService.instance;
  }

  createPublicUploader(): Multer {
    this.uploader = this.createUploader();
    return this.uploader;
  }

  createUploader(folder?: string): Multer {
    this.uploader = multer({
      storage: multerS3({
        s3,
        bucket: config.aws.awsBucket,
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
          const fileName = Date.now() + '-' + file.originalname;
          let filePath: string | null = fileName;
          if (folder) {
            filePath = `${folder}/${fileName}`;
          }
          cb(null, filePath);
        }
      }),
      limits: {
        fileSize: 10 * (1024 * 1024)
      }
    });
    return this.uploader;
  }

  createPrivateUploader(): Multer {
    this.uploader = this.createUploader('user-docs');
    return this.uploader;
  }

  getFilePath(id: string, folder?: string) {
    return path.resolve(process.cwd(), 'uploads', folder ? folder : 'asset-images', id);
  }

  async getImage(filename: string) {
    const params = {
      Bucket: config.aws.awsBucket,
      Key: filename,
      Expires: 3600
    };

    const getObjectCommand = new GetObjectCommand(params);
    const data = await this.s3service.send(getObjectCommand);
    return data.Body;
  }

  async deleteImage(imgKey: any) {
    try {
      const params = {
        Bucket: config.aws.awsBucket,
        Key: imgKey
      };
      const command = new DeleteObjectCommand(params);
      await this.s3service.send(command);
      console.log('File deleted successfully.');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
}
