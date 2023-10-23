import React from 'react';
import axios from '../../../utils/axios';
import { mapTenant } from './serializers';
import { useUserStore } from '../../../globalState/user';
import { TenantType } from './MatchesTenants';

export const useSuggestedTenants = () => {
  const [loading, setLoading] = React.useState(false);
  const [tenants, setTenants] = React.useState<TenantType[]>([]);
  const userStore = useUserStore();

  React.useEffect(() => {
    getSuggestedTenants();
  }, []);

  const getSuggestedTenants = async () => {
    try {
      setLoading(true);
      const { data } = await axios(userStore.auth.access_token).get('/api/suggestion/tenant');
      setTenants(data.docs.map(mapTenant));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tenants,
    loading
  };
};
