import React from 'react';
import { useUserStore } from '../../../globalState/user';
import axiosWithToken from '../../../utils/axios';
import { IProperty } from '../../../react-app-env';

export type TPropertyDetails = {
  property: string;
  views: number;
  starred: number;
  matches: number;
  property_score: number;
  tenants: any[];
  my_chosen_matches: number;
};

export const usePropertyDetailsHook = () => {
  const [property, setProperty] = React.useState<IProperty | null>(null);
  const [propertyDetails, setPropertyDetails] = React.useState<TPropertyDetails | null>(null);
  const { auth } = useUserStore();

  React.useEffect(() => {
    getLatestPropertyWithDetails();
  }, []);

  const getLatestPropertyWithDetails = async () => {
    const { data, status } = await axiosWithToken(auth.access_token).get('/api/asset/last');
    if (status === 200) {
      setProperty(data.property);
      setPropertyDetails(data.details);
    }
  };

  return {
    property,
    propertyDetails
  };
};
