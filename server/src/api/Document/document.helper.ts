import { fileService } from '../index';

import { areArraysOfObjectsIdentical } from '../api.helpers';

export const handleUploadedDocuments = (existingImages: any[], incomingImages: any[], userDocs: any[]) => {
  if (areArraysOfObjectsIdentical(existingImages, incomingImages)) {
    return [...incomingImages];
  } else {
    const imagesToDelete = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((image: any) => {
        fileService.deleteFile(image.key).then(() => console.log('Document deleted!'));
      });
    }

    return incomingImages;
  }
};
