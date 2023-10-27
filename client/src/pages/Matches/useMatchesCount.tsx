import { useUserStore } from '../../globalState/user';
import axios from '../../utils/axios';
import { useQuery } from '@tanstack/react-query';

const getMatchesCount = async ({
  access_token,
  params
}: {
  access_token: string;
  params?: MatchCountParams;
}) => {
  const { data } = await axios(access_token).get('/api/match/count', { params });

  return data;
};

interface MatchCountParams {
  matched?: boolean;
}

export const useMatchesCount = (params?: MatchCountParams) => {
  const userStore = useUserStore();

  const query = useQuery({
    queryKey: ['number'],
    queryFn: () => getMatchesCount({ params, access_token: userStore.auth.access_token }),
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  return query;
};
