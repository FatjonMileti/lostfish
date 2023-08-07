import config from '../../config';
import fileService from '../File/services/file.service';
import S3UploadService from '../File/services/s3-file.service';
const s3UploaderService = S3UploadService.getInstance();

export const getCurrentPropertyTypeForPost = (type: string) => {
  const propertyTypes: any = {
    Detached: 'Detached House',
    'Semi- Detached': 'Semi Detached House',
    Terraced: 'Mid Terrace House',
    Flats: 'Studio Apartment',
    'Farms/Land': 'Industrial'
  };

  return propertyTypes[type];
};

export const getCurrentStatusForPost = (status: string) => {
  const statuses: any = {
    'For Let': 'Live',
    'Let Agreed': 'Sale Agreed',
    Let: 'Exchanged',
    Archived: 'Archived',
    Completed: 'Completed',
    Draft: 'Draft',
    'Pre Draft': 'Pre Draft'
  };
  return statuses[status];
};

export const generateLinksForImages = (docs: any[]) => {
  return docs.map((item: any) => {
    const { property_images } = item;
    item.property_images = generateLinksForOneAsset(property_images);
    return item;
  });
};

export const generateLinksForOneAsset = (propertyImages: any[]) => {
  return propertyImages.map((img: any) => {
    return {
      key: img.key,
      link: img.link
    };
  });
};

interface AnyObject {
  [key: string]: any;
}

export const areArraysOfObjectsIdentical = (arr1: AnyObject[], arr2: AnyObject[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    if (!isObjectEqual(obj1, obj2)) {
      return false;
    }
  }

  return true;
};

function isObjectEqual(obj1: AnyObject, obj2: AnyObject): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const handlePropertyImages = (existingImages: any[], incomingImages: any[], assetId: string) => {
  const oldImages = incomingImages.filter((img: any) => Object.keys(img).length < 3);
  if (areArraysOfObjectsIdentical(existingImages, oldImages)) {
    return [...incomingImages];
  } else {
    const imagesToDelete = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (imagesToDelete.length > 0) {
      if (config.uses3Bucket) {
        imagesToDelete.forEach((img: any) => {
          s3UploaderService.deleteImage(img.key);
        });
      } else {
        imagesToDelete.forEach((img: any) => {
          fileService.removeFile(img.key);
        });
      }
    }

    return incomingImages;
  }
};
