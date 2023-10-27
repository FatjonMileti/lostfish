import React from 'react';
import axios from '../../../utils/axios';
import { mapTenant } from '../../Matches/MatchesTenants/serializers';
import { useUserStore } from '../../../globalState/user';
import { SuggestedTenantType } from '../../Matches/MatchesTenants/MatchesTenants';

export const useSuggestedTenants = (
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
    getSuggestedTenants();
  }, []);

  const getSuggestedTenants = async () => {
    try {
      setLoading(true);
      const { data } = await axios(userStore.auth.access_token).get('/api/suggestion/tenant', {
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
    return getSuggestedTenants();
  };

  return {
    tenants,
    loading,
    reFetch
  };
};
