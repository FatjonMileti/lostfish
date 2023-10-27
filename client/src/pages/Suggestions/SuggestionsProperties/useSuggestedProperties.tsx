import React from 'react';
import axios from '../../../utils/axios';
import { mapTenant } from '../../Matches/MatchesTenants/serializers';
import { useUserStore } from '../../../globalState/user';
import { SuggestedPropertyType } from '../../Matches/MatchesProperties/MatchesProperties';

export const useSuggestedProperties = (
  params = {}
): {
  properties: SuggestedPropertyType[];
  loading: boolean;
  reFetch: () => Promise<void>;
} => {
  const [loading, setLoading] = React.useState(false);
  const [properties, setProperties] = React.useState<SuggestedPropertyType[]>([]);
  const userStore = useUserStore();

  React.useEffect(() => {
    getSuggestedProperties();
  }, []);

  const getSuggestedProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios(userStore.auth.access_token).get('/api/suggestion/asset', {
        params
      });
      setProperties(data.docs);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const reFetch = async () => {
    return getSuggestedProperties();
  };

  return {
    properties,
    loading,
    reFetch
  };
};
