import axios from '../../../utils/axios';
import { mapTenant } from './serializers';
import { useUserStore } from '../../../globalState/user';
import { SuggestedTenantType } from './MatchesTenants';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useMatchedTenants = ({
  params = {},
  options = {}
}: {
  params?: { disliked?: boolean; chosen?: boolean };
  options?: UseQueryOptions;
}) => {
  const userStore = useUserStore();

  const getMatchedTenants = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params
      });
      return data.docs.map(mapTenant);
    } catch (err) {
      throw err;
    }
  };

  const query = useQuery<SuggestedTenantType[]>({
    queryKey: ['matched-tenants'],
    queryFn: () => getMatchedTenants(),
    initialData: [],
    refetchIntervalInBackground: false,
    refetchOnMount: !!options.refetchOnMount,
    refetchOnWindowFocus: false
  });

  return query;
};
