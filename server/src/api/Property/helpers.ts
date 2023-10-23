import config from '../../config/index';
import { fileService } from '../index';
import { areArraysOfObjectsIdentical } from '../api.helpers';
import { PropertyDocument } from './property.interface';

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

export const getPropertyScore = (property: PropertyDocument) => {
  return (
    (100 / 7) *
    [
      !!property.title,
      !!property.property_images.length,
      !!property.area_of_interest,
      !!property.budget.min_budget && !!property.budget.max_budget,
      !!property.property_type &&
        !!property.room_details.number_of_bedrooms &&
        !!property.room_details.number_of_bathrooms &&
        !!property.floor_size &&
        !!property.parking_spot &&
        !!property.epc_rating,
      !!property.description,
      true
    ].filter((d) => d).length
  ).toFixed(0);
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
      link: img?.link?.startsWith('https://') ? img.link : `${config.apiUrl}/api/file/${img.key}`
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
