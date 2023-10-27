import React from 'react';
import axios from '../../../utils/axios';
import { mapTenant } from './serializers';
import { useUserStore } from '../../../globalState/user';
import { SuggestedTenantType } from './MatchesTenants';

export const useMatchedTenants = (
  params = {}
): {
  tenants: SuggestedTenantType[];
  loading: boolean;
  reFetch: () => Promise<void>;
} => {
  const [loading, setLoading] = React.useState(false);
  const [tenants, setTenants] = React.useState<SuggestedTenantType[]>([]);
  const userStore = useUserStore();

  React.useEffect(() => {
    getMatchedTenants();
  }, []);

  const getMatchedTenants = async () => {
    try {
      setLoading(true);
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params
      });
      setTenants(data.docs.map(mapTenant));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const reFetch = async () => {
    return getMatchedTenants();
  };

  return {
    tenants,
    loading,
    reFetch
  };
};
