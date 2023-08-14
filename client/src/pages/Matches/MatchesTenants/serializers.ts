export const mapTenants = (docs: any) => {
  return docs.map(({ criteria, chosen, starred, percentage, suggestion_id, matchId, property }: any) => ({
    id: criteria._id,
    criteria: {
      avatar: criteria.created_by.avatar,
      firstName: criteria.created_by.first_name,
      lastName: criteria.created_by.last_name,
      propertyType: criteria?.property_type || [],
      propertyPreferences: criteria?.property_preferences || [],
      areaOfInterest: criteria?.area_of_interest || '',
      radius: criteria?.radius ? `${criteria?.radius} mi` : '',
      moveIn: criteria?.moving_time || '',
      budget: (criteria?.budget || '')
        .split(' - ')
        .map((v: string) => (!isNaN(parseInt(v)) ? `£${parseInt(v).toLocaleString()}` : ''))
        .join(' - '),
      nrOfBedrooms: criteria?.room_details?.number_of_bedrooms || '',
      nrOfBathrooms: criteria?.room_details?.number_of_bathrooms || '',
      specificPropertyFeatures: criteria?.specific_property_features || [],
      depositAmount: criteria?.deposit_amount || '',
      tenantId: criteria.created_by._id
    },
    property,
    chosen,
    starred,
    percentage,
    suggestion_id,
    matchId
  }));
};
