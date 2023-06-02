import { useProperty } from '../../PropertyContext';
import { Grid, Card, CardHeader, CardMedia } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Button } from '../../../../../components/Button';
import { useForm } from 'react-hook-form';
import { FormControlledSelect } from '../../../components/FormControlledSelect';
import { PersonTitle } from '../../../property.interface';
import { TextField } from '../../../../../components/TextField';
import React from 'react';
import axios from '../../../../../utils/axios';
import { useGlobalState } from '../../../../../globalState';
import { useParams } from 'react-router-dom';
import { Typography } from '../../../../../components/Typography';

export const Overview = () => {
  const { property, isInitialized } = useProperty();

  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  const params = useParams<{ id: string }>();

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

  if (!isInitialized) {
    return <div>Loader...</div>;
  }

  return (
    <Grid container spacing={2} mt={2} mb={2}>
      <Grid item md={4}>
        <Card>
          <CardHeader title={property.name} />
          <CardMedia component='img' height='300' image={property.property_images[0]} alt='Test image' />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6}>
                Status
              </Grid>
              <Grid item md={6}>
                <b>{property.status_string}</b>
              </Grid>
              <Grid item md={6}>
                Sale type
              </Grid>
              <Grid item md={6}>
                <b>{property.transaction_type_string}</b>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4}>
        <Card>
          <CardHeader title='Client' />
          <CardContent>
            <Button>Add client</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4}>
        <Card>
          <CardHeader title='Invite applicant' />
          <CardContent>
            {['Live', 'For Let'].includes(property.status_string) ? (
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
            ) : (
              <Typography variant='body5'>Asset need to be live to add applicant</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4}>
        <CardHeader title='Successful Applicant' />
        <CardContent>
          {property.buyers?.map((buyer: any) => {
            return (
              <Grid container>
                <Grid item md={6}>
                  Name
                </Grid>
                <Grid item md={6}>
                  <b>{buyer.client.first_name}</b>
                </Grid>
                <Grid item md={6}>
                  Surname
                </Grid>
                <Grid item md={6}>
                  <b>{buyer.client.surname}</b>
                </Grid>
              </Grid>
            );
          })}
        </CardContent>
      </Grid>
    </Grid>
  );
};
