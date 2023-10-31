import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { YourProperty } from '../../PagesComponents/YourProperty';
import propertyImage from '../images/property.png';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import axios from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../globalState/user';

import { NewProperty } from '../../Properties/NewProperty/NewProperty';

export const DashboardYourProperties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const [showEditProperty, setShowEditProperty] = React.useState(false);

  const getAssets = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/asset', {
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

  const property = !propertiesQuery.isLoading && propertiesQuery.data[0];

  const editProperty = () => {
    setShowEditProperty(property._id);
  };

  return (
    <>
      <div className={classNames('your-properties', className)}>
        <Typography className='title' variant='body4'>
          Your properties
        </Typography>

        {!!property && (
          <YourProperty
            title={property?.title}
            price={`${property?.budget?.min_budget} - ${property?.budget?.max_budget}`}
            address={property?.area_of_interest}
            image={property?.property_images?.[0]?.link}
            editProperty={editProperty}
          />
        )}
      </div>
      {showEditProperty && (
        <NewProperty
          propertyId={property._id}
          showStore={[showEditProperty, setShowEditProperty]}
          setEditPropertyId={() => {}}
          afterSave={() => propertiesQuery.refetch()}
          afterDelete={() => propertiesQuery.refetch()}
        />
      )}
    </>
  );
})`
  &.your-properties {
    display: grid;
    row-gap: 16px;
    grid-template-rows: min-content auto;
    grid-area: b;

    .title {
      font-size: 18px;
      font-weight: 700;
    }
  }
`;
