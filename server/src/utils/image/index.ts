import { S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import multer, { Multer } from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
  serviceId: 'YOUR_ACCESS_KEY',
  region: 'YOUR_REGION'
});

export default class UploadService {
  private static instance: UploadService;
  private uploader!: Multer;

  private constructor() {}

  // INSTANCE CREATE FOR MAIL
  static getInstance() {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  // CREATE UPLOADER FOR LOCAL
  createLocalUploader(): Multer {
    this.uploader = multer({ dest: 'uploads/asset-images' });
    return this.uploader;
  }

  // CREATE A UPLOADER FOR LIVE
  createLiveUploader(): Multer {
    this.uploader = multer({
      storage: multerS3({
        s3,
        bucket: 'some-bucket',
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
          cb(null, Date.now().toString());
        }
      })
    });
    return this.uploader;
  }
}
