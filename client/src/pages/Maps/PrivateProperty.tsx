import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Grid, Paper } from '@mui/material';
import { Map } from './components/Map';
import { NearestPlaces } from './components/NearestPlaces';
import { NearestSchools } from './components/NearestSchools';
import { NearestImportantPlaces } from './components/NearestImportantPlaces';
import { useGlobalState } from '../../globalState';
import axios from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '../../components/TextField';
import { MasterAssetTypeSring, PersonTitle } from '../Properties/property.interface';
import { FormControlledSelect } from '../Properties/components/FormControlledSelect';
import { PreApprovalApplication } from './components/PreApprovalApplication';

export const PrivateProperty = () => {
  const [property, setProperty] = React.useState<any>(null);
  const [conditions, setConditions] = React.useState<any[]>([]);
  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    getValues,
    reset
  } = useForm();

  const params = useParams<{ id: string }>();

  React.useEffect(() => {
    if (params.id) {
      getPropertyDetails();
      getConditions();
    }
  }, []);

  const getPropertyDetails = async () => {
    const response = await axios(auth.access_token).get('/api/asset/' + params.id);
    setProperty(response.data);
  };

  const getConditions = async () => {
    const response = await axios(auth.access_token).get('/api/condition');
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

  const onSubmit = async (data: any) => {
    try {
      const response = await axios(auth.access_token).post(`/api/asset/${params.id}/send-invitation`, data);
      alert('Success');
      reset();
    } catch (errors) {
      // Reset the form errors
      clearErrors();
    }
  };

  return (
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
            {userDetails && userDetails.role === 'Admin' ? (
              <Grid container spacing={3} mt={3} mb={5}>
                <Grid item md={6}>
                  <Button>Add invitation</Button>
                </Grid>
                <Grid item md={6}>
                  <Button>Add offer</Button>
                </Grid>

                <Grid item md={6}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={6}>
                        <FormControlledSelect
                          control={control}
                          values={[
                            ['A lint to the asset', 'A lint to the asset'],
                            ['Wish to place offer', 'Wish to place offer'],
                            ['Wish to access the document vault', 'Wish to access the document vault'],
                            ['Wish to book a review', 'Wish to book a review'],
                            ['Wish to see other offers', 'Wish to see other offers']
                          ]}
                          name='invite_reason'
                          label='Reason for invite'
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <FormControlledSelect
                          control={control}
                          values={[
                            ['Single Invite', 'Single Invite'],
                            ['Bulk Invite', 'Bulk Invite']
                          ]}
                          name='invite_type'
                          label='Bulk or single Invite'
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <FormControlledSelect
                          control={control}
                          values={Object.entries(PersonTitle)}
                          name='title'
                          label='Title'
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <TextField
                          label='Firstname'
                          variant='outlined'
                          {...register('first_name')}
                          error={!!errors?.first_name}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <TextField
                          label='Surname'
                          variant='outlined'
                          {...register('last_name')}
                          error={!!errors?.last_name}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <TextField
                          label='E-mail'
                          variant='outlined'
                          {...register('email')}
                          error={!!errors?.email}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <TextField
                          label='Phone'
                          variant='outlined'
                          {...register('phone')}
                          error={!!errors?.phone}
                        />
                      </Grid>
                    </Grid>
                    <Grid container mt={3}>
                      <Button type='submit'>Submit</Button>
                    </Grid>
                  </form>
                </Grid>

                <Grid item md={6}></Grid>
              </Grid>
            ) : (
              <PreApprovalApplication />
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
  );
};
