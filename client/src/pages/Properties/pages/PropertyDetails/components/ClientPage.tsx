import { useProperty } from '../../PropertyContext';
import React from 'react';
import { Grid } from '@mui/material';
import { Typography } from '../../../../../components/Typography';
import { Map } from './Map';
import Box from '@mui/material/Box';
import { Button } from '../../../../../components/Button';
import { NearestPlaces } from './NearestPlaces';
import { NearestSchools } from './NearestSchools';
import { NearestImportantPlaces } from './NearestImportantPlaces';
import { PreApprovalApplication } from './PreApprovalApplication';

export const ClientPage = () => {
  const { property, isInitialized } = useProperty();

  if (!property || !isInitialized) {
    return <div>Loader...</div>;
  }

  const address = React.useMemo(() => {
    if (property) {
      return {
        lat: property?.asset_address?.latitude ?? 0,
        lng: property?.asset_address?.longitude ?? 0
      };
    } else {
      return {
        lat: 0,
        lng: 0
      };
    }
  }, [property]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Typography variant='h3'>{property.name}</Typography>
        <Typography variant='body2'>Description...</Typography>
        <Map address={address} />
      </Grid>

      <Grid item xs={6} md={6}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt='2rem' mb={2}>
          <Button>Nearest stations</Button>
          <Button>Nearest schools</Button>
          <Button>Important places</Button>
        </Box>
        <Grid container>
          <Grid item md={4}>
            <NearestPlaces location={address} />
          </Grid>
          <Grid item md={4}>
            <NearestSchools location={address} />
          </Grid>
          <Grid item md={4}>
            <NearestImportantPlaces location={address} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6}>
        <PreApprovalApplication />
      </Grid>
    </Grid>
  );
};
