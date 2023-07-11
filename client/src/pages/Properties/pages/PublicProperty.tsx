import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Grid, Paper } from '@mui/material';
import { Map } from './PropertyDetails/components/Map';
import { NearestPlaces } from './PropertyDetails/components/NearestPlaces';
import { NearestSchools } from './PropertyDetails/components/NearestSchools';
import { NearestImportantPlaces } from './PropertyDetails/components/NearestImportantPlaces';
import { useGlobalState } from '../../../globalState/globalState';
import axios from '../../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../HomeLoggedIn/Header';

import { useUserStore } from '../../../globalState/user';

export const PublicProperty = () => {
  const [property, setProperty] = React.useState<any>(null);
  const [conditions, setConditions] = React.useState<any[]>([]);

  const { auth } = useUserStore();

  const navigate = useNavigate();

  const params = useParams<{ id: string }>();

  React.useEffect(() => {
    if (params.id) {
      getPropertyDetails();
      getConditions();
    }
  }, []);

  const getPropertyDetails = async () => {
    const response = await axios(null).get('/api/asset/' + params.id);
    setProperty(response.data);
  };

  const getConditions = async () => {
    const response = await axios(null).get('/api/condition');
    setConditions(response.data.docs);
  };

  const address = React.useMemo(() => {
    if (property) {
      return {
        lat: property.asset_address.latitude,
        lng: property.asset_address.longitude
      };
    } else {
      return null;
    }
  }, [property]);

  return (
    <div className={`properties-page`}>
      <Header />
      <div className='container'>
        <Paper>
          <Box sx={{ width: '90%', marginLeft: '10rem', padding: '12px', marginTop: '2rem' }}>
            {property && address ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={5} md={5}>
                    <Typography variant='h3'>{property.name}</Typography>
                    <Typography variant='body2'>Description...</Typography>
                    <Map address={address} />
                  </Grid>

                  <Grid item xs={6} md={6}>
                    <Box sx={{ display: 'flex' }} mt='2rem' mb={2}>
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
                </Grid>

                {!auth && (
                  <Grid container spacing={3} mt={3} mb={5}>
                    <Grid item md={6}>
                      <p>Don't have account?</p>
                      <Button
                        onClick={() =>
                          navigate('/create-account', {
                            state: { url: `/properties/${params.id}` }
                          })
                        }>
                        Create an account
                      </Button>
                    </Grid>
                    <Grid item md={6}>
                      <p>Have an account?</p>
                      <Button
                        onClick={() =>
                          navigate('/login', {
                            state: { url: `/properties/${params.id}` }
                          })
                        }>
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid container spacing={3} mt={3}>
                  {property.property_images.map((item: string, index: number) => {
                    return (
                      <Grid item md={4}>
                        <img src={item} height='200px' width='250px' />
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            ) : null}
          </Box>
        </Paper>
      </div>
    </div>
  );
};
