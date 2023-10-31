import React from 'react';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { SuggestedPropertyType } from './MatchesProperties';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useMatchedProperties = ({
  params = {},
  options = {}
}: {
  params?: { disliked?: boolean; chosen?: boolean };
  options?: UseQueryOptions;
}) => {
  const userStore = useUserStore();

  const getMatchedProperties = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params
      });
      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const query = useQuery<SuggestedPropertyType[]>({
    queryKey: ['matched-properties'],
    queryFn: () => getMatchedProperties(),
    initialData: [],
    refetchIntervalInBackground: false,
    refetchOnMount: !!options.refetchOnMount,
    refetchOnWindowFocus: false
  });

  return query;
};
