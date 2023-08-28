import config from '../../config';
import { fileService } from '../index';
import { areArraysOfObjectsIdentical } from '../api.helpers';

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
      ...img,
      link: img.link.startsWith('https://') ? img.link : `${config.api_url}/api/file/${img.key}`
    };
  });
};

export const handlePropertyImages = (existingImages: any[], incomingImages: any[]) => {
  const oldImages = incomingImages.filter((img: any) => !img.hasOwnProperty('isNew'));
  if (areArraysOfObjectsIdentical(existingImages, oldImages)) {
    return [...generateLinksForOneAsset(incomingImages)];
  } else {
    const deletedImages = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (deletedImages.length > 0) {
      deletedImages.forEach((img: any) => {
        fileService.deleteFile(img.key).then(() => console.log('File Deleted!'));
      });
    }

    return generateLinksForOneAsset(incomingImages);
  }
};
