import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { ViewProperty } from '../../Matches/MatchesProperties/ViewProperty';
import { SuggestedPropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { useQuery } from '@tanstack/react-query';
import { PropertyMatch } from '../../PagesComponents/PropertyMatch';

export const StarredMatchesProperties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const getAssets = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: {
          pageSize: 10,
          page: 1
        }
      });
      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const propertiesQuery = useQuery(['your-properties'], getAssets, {
    refetchOnWindowFocus: false
  });

  const [propertyToView, setPropertyToView] = React.useState<SuggestedPropertyType | null>(null);

  return (
    <>
      <div className={`properties ${className}`}>
        {(propertiesQuery.data || []).map((match: any, matchIndex: number) => {
          return (
            <PropertyMatch
              key={matchIndex}
              viewProperty={() => setPropertyToView(match)}
              title={match.property.title}
              image={match.property.property_images[0]?.link}
              address={match.property.area_of_interest}
              price={`${match.property?.budget?.min_budget || ''} - ${
                match.property?.budget?.max_budget || ''
              }`}
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
  &.properties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;
