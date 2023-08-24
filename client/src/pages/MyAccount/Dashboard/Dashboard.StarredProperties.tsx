import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { ViewProperty } from '../../Matches/MatchesProperties/ViewProperty';
import { PropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { useQuery } from '@tanstack/react-query';
import { PropertyMatch } from '../../PagesComponents/PropertyMatch';
import { Typography } from '../../../components/Typography';
import classNames from 'classnames';

export const DashboardStarredProperties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const getAssets = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: {
          pageSize: 1,
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

  const [propertyToView, setPropertyToView] = React.useState<PropertyType | null>(null);

  return (
    <>
      <div className={classNames('recently-starred-properties', className)}>
        <Typography className='title' variant='body4'>
          Recently starred properties
        </Typography>

        <div className='properties'>
          {(propertiesQuery.data || []).map((match: any, matchIndex: number) => {
            return (
              <PropertyMatch
                key={matchIndex}
                viewProperty={() => setPropertyToView(match)}
                title={match?.property?.title}
                image={match?.property?.property_images?.[0]?.link}
                address={match?.property?.area_of_interest}
                price={`${match.property?.budget?.min_budget} - ${match.property?.budget?.max_budget}`}
              />
            );
          })}
        </div>
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
  &.recently-starred-properties {
    display: grid;
    row-gap: 16px;
    grid-template-rows: min-content auto;

    .title {
      font-size: 18px;
      font-weight: 700;
    }

    .properties {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
`;
