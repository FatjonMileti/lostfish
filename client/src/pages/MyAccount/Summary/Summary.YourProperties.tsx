import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { YourProperty } from '../../PagesComponents/YourProperty';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import axios from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../globalState/user';

import { EditPropertyModal } from '../../Properties/NewProperty/EditPropertyModal';

export const SummaryYourProperties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
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

  console.log('property: ', property);

  return (
    <>
      <div className={classNames('your-properties', className)}>
        <Typography className='title' variant='body4'>
          Your properties
        </Typography>

        {!!property && (
          <YourProperty
            title={property?.title}
            price={property?.asset_rent?.rental_amount?.toLocaleString()}
            bathrooms={property?.room_details?.number_of_bathrooms}
            bedrooms={property?.room_details?.number_of_bedrooms}
            status={property?.status_string}
            image={property?.property_images?.[0]?.link}
            editProperty={editProperty}
          />
        )}
      </div>
      {showEditProperty && (
        <EditPropertyModal
          propertyId={property._id}
          showStore={[showEditProperty, setShowEditProperty]}
          afterSave={() => propertiesQuery.refetch()}
          afterDelete={() => propertiesQuery.refetch()}
          onBack={() => setShowEditProperty(false)}
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
