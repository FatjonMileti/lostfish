import config from '../../config';
import fileService from '../File/services/file.service';
import S3UploadService from '../File/services/s3-file.service';
const s3UploaderService = S3UploadService.getInstance();
import { areArraysOfObjectsIdentical } from '../api.helpers';

export const handleUploadedDocuments = (existingImages: any[], incomingImages: any[], userDocs: any[]) => {
  const userDocsNotDeleteKeys: string[] = userDocs.map((doc: any) => doc.key);
  if (areArraysOfObjectsIdentical(existingImages, incomingImages)) {
    return [...incomingImages];
  } else {
    const imagesToDelete = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (imagesToDelete.length > 0) {
      if (config.uses3Bucket) {
        imagesToDelete
          .filter((item: any) => !userDocsNotDeleteKeys.includes(item.key))
          .forEach((img: any) => {
            s3UploaderService.deleteImage(img.key);
          });
      } else {
        imagesToDelete
          .filter((item: any) => !userDocsNotDeleteKeys.includes(item.key))
          .forEach((img: any) => {
            fileService.removeFile(img.key);
          });
      }
    }

    return incomingImages;
  }
};
