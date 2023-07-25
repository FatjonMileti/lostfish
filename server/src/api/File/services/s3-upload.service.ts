import { S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import multer, { Multer } from 'multer';
import multerS3 from 'multer-s3';
import config from '../../../config';
import fs from 'fs';

const AWS = require('aws-sdk');
const s3AWS = new AWS.S3();

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

export default class S3UploadService {
  private static instance: S3UploadService;
  private uploader!: Multer;
  private s3service = s3AWS;

  private constructor() {}

  static getInstance(): S3UploadService {
    if (!S3UploadService.instance) {
      S3UploadService.instance = new S3UploadService();
    }
    return S3UploadService.instance;
  }

  createPublicUploader(): Multer {
    this.uploader = multer({
      storage: multerS3({
        s3,
        bucket: config.aws.awsBucket,
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
          const fileName = Date.now() + '-' + file.originalname;
          cb(null, fileName);
        }
      })
    });
    return this.uploader;
  }

  createPrivateUploader(): Multer {
    this.uploader = multer({
      storage: multerS3({
        s3,
        bucket: config.aws.awsBucket,
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
          const fileName = Date.now() + '-' + file.originalname; // Generate a unique file name
          const filePath = 'user-docs/' + fileName;
          cb(null, filePath);
        }
      })
    });
    return this.uploader;
  }

  async getImage(filename: string) {
    const params = {
      Bucket: config.aws.awsBucket,
      Key: filename,
      Expires: 3600
    };
    return new Promise((resolve, reject) => {
      return this.s3service.getSignedUrl('getObject', params, (error: any, url: string) => {
        if (error) return reject(new Error(error));
        return resolve(url);
      });
    });
  }

  deleteImage(img: any) {
    try {
      // Clean up the temporary file after it is sent
      fs.unlink(img, (error: any) => {
        if (error) {
          console.error('Error deleting the temporary file:', error);
        } else {
          console.log('Temporary file deleted.');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
