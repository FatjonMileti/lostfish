import axios from 'axios';

import { SuggestedPropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { useQuery } from '@tanstack/react-query';
import config from '../../../config';

export const useSuggestedPropertiesWithoutAccount = () => {
  const getSuggestedProperties = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/suggestion/without-account/properties`,

        {
          asset_address: {
            latitude: 51.5072178,
            longitude: -0.1275862
          },
          house_details: {
            preferred_size: {
              size: {
                min: 1000,
                max: 10000
              },
              unit: 'sq.ft'
            },
            garden: {
              size: {
                min: 1000,
                max: 10000
              },
              unit: 'sq.ft'
            },
            storeys: {
              min: 1,
              max: 4
            },
            number_of_bathrooms: {
              min: 1,
              max: 4
            },
            number_of_bedrooms: {
              min: 1,
              max: 5
            },
            house_type: ['Detached', 'Semi-Detached', 'Farms/Land']
          },
          flat_details: {
            preferred_size: {
              size: {
                min: 400,
                max: 3503
              },
              unit: 'sq.ft'
            },
            number_of_bathrooms: {
              min: 1,
              max: 4
            },
            number_of_bedrooms: {
              min: 1,
              max: 5
            },
            property_purpose: 'Purpose built',
            preferred_floor: 'Ground',
            outside_space: [],
            lift: true,
            security: true,
            parking_space: false,
            gym_spa: false
          },
          room_details: {
            number_of_bathrooms: '1-3',
            number_of_bedrooms: '1-4'
          },
          distance_from_underground: {
            value: null,
            unit: 'km'
          },
          distance_from_schools: {
            value: null,
            unit: 'km'
          },
          distance_from_high_street: {
            value: null,
            unit: 'km'
          },
          distance_from_gym: {
            value: null,
            unit: 'km'
          },
          _id: '654badf57bc88d5d442c489b',
          area_of_interest: 'London, UK',
          radius: '10',
          property_type: ['Flats', 'House'],
          property_preferences: ['New home', 'Retirement home'],
          property_features: ['Shopping centers nearby'],
          floor_size: '100-200',
          parking_details: [],
          floor_size_unit: 'sq.m',
          specific_property_features: ['Close to public transport', 'Allows smoking'],
          budget: '500 - 1500',
          deposit_amount: '394',
          contract_details: ['Guarantor', 'Energy Certificate', 'Reviewed Property'],
          credit_score_requirements: 'Good',
          transaction_type_string: 'Rent',
          outside_space: [],
          currency_code: 'AUD',
          looking_for: 'I’m looking for a place',
          created_by: '654badf47bc88d5d442c4865',
          created_at: '2023-11-08T15:49:09.378Z',
          __v: 1,
          budget_for: 'Month'
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

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
