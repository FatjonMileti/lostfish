import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { SuggestedPropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useSuggestedProperties = ({
  params = {},
  options = {}
}: {
  params?: { disliked?: false; chosen?: false };
  options?: UseQueryOptions;
}) => {
  const userStore = useUserStore();

  const getSuggestedProperties = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/suggestion/asset', {
        params
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const query = useQuery<SuggestedPropertyType[]>({
    queryKey: ['suggested-properties'],
    queryFn: () => getSuggestedProperties(),
    initialData: [],
    refetchIntervalInBackground: false,
    refetchOnMount: !!options.refetchOnMount,
    refetchOnWindowFocus: false
  });

  return query;
};
