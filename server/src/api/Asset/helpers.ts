import { AssetDocument } from './asset.interface';

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

export const getCurrentPropertyTypeForGet = (type: string) => {
  const propertyTypes: any = {
    'Detached House': 'Detached',
    'Semi Detached House': 'Semi- Detached',
    'Mid Terrace House': 'Terraced',
    'Studio Apartment': 'Flats',
    Industrial: 'Farms/Land'
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

export const validateToSendToOffrIo = (asset: AssetDocument): boolean => {
  let isValid = false;
  if (
    asset.name &&
    asset.status_string &&
    asset.transaction_type_string &&
    asset.property_type &&
    asset.asset_address.latitude &&
    asset.asset_address.longitude &&
    asset.asset_address.postal_code
  ) {
    isValid = true;
  }
  /*TODO Uncomment this for validating correctly property to send in offr.io*/
  // return isValid;
  return false;
};
