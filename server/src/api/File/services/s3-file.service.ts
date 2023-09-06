import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import config from '../../../config/index';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileService } from '../file.interface';
import FilesCollection from '../../../data/files.collection';

/*
  TODO Implement image resize if needed
  import sharp from 'sharp';
  const buffer = await sharp(file.buffer).resize({ height: 1080, width: 721, fit: 'contain' }).toBuffer();
*/
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export default class S3FileService implements FileService {
  private s3service = s3;

  async uploadFile(file: any): Promise<string> {
    try {
      const params = {
        Bucket: config.aws.awsBucket,
        Key: file.key,
        Body: file.buffer
      };

      const command = new PutObjectCommand(params);
      await this.s3service.send(command);

      return '';
    } catch (err: any) {
      console.log(err);
      return '';
    }
  }

  async uploadFiles(files: any[]): Promise<any[]> {
    for (const file of files) {
      file.key = `${randomImageName()}-${file.originalname}`;
      await this.uploadFile(file);
    }

    await FilesCollection.insertMany(files);
    const updatedFiles: any[] = [];

    for (const file of files) {
      updatedFiles.push({
        key: file.key,
        mimetype: file.mimetype,
        originalname: file.originalname,
        link: `${config.apiUrl}/api/file/${file.key}`,
        isNew: true
      });
    }

    return updatedFiles;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const params = {
        Bucket: config.aws.awsBucket,
        Key: fileUrl
      };
      const command = new DeleteObjectCommand(params);
      await this.s3service.send(command);
      await FilesCollection.deleteOne({ filename: fileUrl });
      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  }

  async getFile(fileUrl: string): Promise<string> {
    const params = {
      Bucket: config.aws.awsBucket,
      Key: fileUrl,
      Expires: 3600
    };

    const command = new GetObjectCommand(params);
    // @ts-ignore
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  }
}
