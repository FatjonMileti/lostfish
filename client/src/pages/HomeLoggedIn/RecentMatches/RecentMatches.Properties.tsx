import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { ViewProperty } from '../../Matches/MatchesProperties/ViewProperty';
import { PropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { useQuery } from '@tanstack/react-query';
import { PropertyMatch } from '../../PagesComponents/PropertyMatch';

export const RecentMatchesProperties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const getAssets = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: {
          pageSize: 5,
          page: 1
        }
      });
      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const propertiesQuery = useQuery(['recent-matches-properties'], getAssets, {
    refetchOnWindowFocus: false
  });

  const [propertyToView, setPropertyToView] = React.useState<PropertyType | null>(null);

  return (
    <>
      <div className={`recent-matches-properties ${className}`}>
        {(propertiesQuery.data || []).map((match: any, matchIndex: number) => {
          return (
            <PropertyMatch
              className='recent-match'
              key={matchIndex}
              viewProperty={() => setPropertyToView(match)}
              title={match.property.title}
              image={match.property.property_images[0]?.link}
              address={match.property.area_of_interest}
              price={`${match.property?.budget?.min_budget} - ${match.property?.budget?.max_budget}`}
            />
          );
        })}
      </div>

      {propertyToView && (
        <ViewProperty
          open={!!propertyToView}
          starProperty={() => {}}
          closeModal={() => setPropertyToView(null)}
          onBackdropClick={() => setPropertyToView(null)}
          propertyToView={propertyToView}
        />
      )}
    </>
  );
})`
  &.recent-matches-properties {
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: 16px;
    //overflow-x: hidden;
    box-sizing: border-box;
    align-self: stretch;
    margin-right: -36px;

    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;

    .recent-match {
      min-width: 464px;
    }
  }
`;
