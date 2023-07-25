import config from '../../config';

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

export const getCurrentStatusForGet = (status: string) => {
  const statuses: any = {
    Live: 'For Let',
    'Sale Agreed': 'Let Agreed',
    Exchanged: 'Let',
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
    if (!img?.key?.startsWith('https://')) {
      return `${config.api_url}/api/file/${img?.key}`;
    }
    return img.key || img.filename;
  });
};
