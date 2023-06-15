import { AssetDocument } from './asset.interface';

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
    asset.master_asset_type_string &&
    asset.asset_type_string &&
    asset.asset_address.latitude &&
    asset.asset_address.longitude &&
    asset.asset_address.postal_code
  ) {
    isValid = true;
  }
  return isValid;
};
