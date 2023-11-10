import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import config from '../../../config';
import { useCriteriaStore } from '../../../globalState/criteria';
import { SuggestedPropertyType } from '../../Matches/matches.type';

export const useSuggestedPropertiesWithoutAccount = () => {
  const criteriaStore = useCriteriaStore();
  const getSuggestedProperties = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/suggestion/without-account/properties`,

        criteriaStore.criteria
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const query = useQuery<SuggestedPropertyType[]>({
    queryKey: ['suggested-properties-without-account'],
    queryFn: () => getSuggestedProperties(),
    initialData: [],
    refetchIntervalInBackground: false,

    refetchOnWindowFocus: false,
    retry: false
  });

  return query;
};
