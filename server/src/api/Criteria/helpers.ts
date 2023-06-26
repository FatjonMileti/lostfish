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
