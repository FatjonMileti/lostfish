import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import Grid from '@mui/material/Grid';
import { Map } from './components/Map';
import { NearestPlaces } from './components/NearestPlaces';
import { NearestSchools } from './components/NearestSchools';
import { NearestImportantPlaces } from './components/NearestImportantPlaces';
import { useGlobalState } from '../../globalState';
import axios from '../../utils/axios';
import { useParams } from 'react-router-dom';

export const Maps = () => {
  const [dense, setDense] = React.useState(false);
  const [property, setProperty] = React.useState<any>(null);
  const {
    user: [{ auth }]
  } = useGlobalState();

  const params = useParams<any>();

  React.useEffect(() => {
    if (params.id) getPropertyDetails();
  }, []);

  const getPropertyDetails = async () => {
    const response = await axios(auth.access_token).get('/api/asset/' + params.id);
    setProperty(response.data);
  };

  const address = React.useMemo(() => {
    if (property) {
      return {
        lat: property.asset_address.latitude,
        lng: property.asset_address.longitude
      };
    }
  }, property);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {property && address ? (
        <Grid container spacing={2}>
          <Grid item xs={8} md={8}>
            <Typography variant='h3'>{property.name}</Typography>
            <Typography variant='body2'>
              Morbi posuere, nibh vel mollis finibus, sem felis varius est, ac sodales ipsum ipsum sed dolor.
              Proin odio metus, rhoncus non congue eget, tempus id metus. Sed porttitor dictum sapien.
            </Typography>
          </Grid>
          <Grid item xs={4} md={4}></Grid>
          <Grid item xs={8} md={8}>
            <Map address={address} />
            <Box sx={{ display: 'flex' }} mt='2rem'>
              <Button>Nearest stations</Button>
              <Button>Nearest schools</Button>
              <Button>Important places</Button>
            </Box>
            <Box>
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
            </Box>
          </Grid>
          <Grid item xs={4} md={4}></Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      ) : null}
    </Box>
  );
};
