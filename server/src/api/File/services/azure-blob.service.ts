import FilesCollection from '../../../data/files.collection';
import { FileService } from '../file.interface';
import config from '../../../config/index';
import crypto from 'crypto';
import { BlobServiceClient } from '@azure/storage-blob';
import createError from 'http-errors';
import httpStatus from 'http-status';

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.storageConnectionString);
const containerClient = blobServiceClient.getContainerClient(config.azure.azureStorageName);

export default class AzureBlobService implements FileService {
  async uploadFile(file: any): Promise<any> {
    const blockBlobClient = containerClient.getBlockBlobClient(file.key);
    await blockBlobClient.uploadData(file.buffer, file.mimetype);
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
        originalName: file.originalname,
        link: `${config.apiUrl}/api/file/${file.key}`,
        isNew: true
      });
    }

    return updatedFiles;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl) {
      return false;
    }

    try {
      const blockBlobClient = containerClient.getBlockBlobClient(fileUrl);
      await blockBlobClient.delete();
      console.log('File deleted successfully.');
      return true;
    } catch (error) {
      console.error('Error deleting file from Azure Blob Storage:', error);
      return false;
    }
  }

  async getFile(fileUrl: string): Promise<any> {
    const blobClient = containerClient.getBlobClient(fileUrl);

    try {
      const downloadBlockBlobResponse = await blobClient.download(0);
      if (!downloadBlockBlobResponse.readableStreamBody) {
        throw createError(httpStatus.BAD_REQUEST, { message: 'error reading file' });
      }
      return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data: Buffer | Uint8Array) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}
