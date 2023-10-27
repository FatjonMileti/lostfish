import React from 'react';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { SuggestedPropertyType } from './MatchesProperties';

export const useMatchedProperties = (
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
    getMatchedProperties();
  }, []);

  const getMatchedProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
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
    return getMatchedProperties();
  };

  return {
    properties,
    loading,
    reFetch
  };
};
