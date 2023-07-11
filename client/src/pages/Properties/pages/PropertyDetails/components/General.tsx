import React from 'react';
import { useProperty } from '../../PropertyContext';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Typography } from '../../../../../components/Typography';
import { Map } from './Map';
import { Controller, useForm } from 'react-hook-form';
import axios from '../../../../../utils/axios';
import { useGlobalState } from '../../../../../globalState/globalState';
import { useParams } from 'react-router-dom';
import { StatusRent, StatusSale } from '../../../property.interface';
import { Button } from '../../../../../components/Button';

import { useUserStore } from '../../../../../globalState/user';

export const General = () => {
  const { property, isInitialized } = useProperty();

  const { auth } = useUserStore();

  const params = useParams<{ id: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm({
    defaultValues: {
      status_string: 'Draft',
      transaction_type_string: ''
    }
  });

  React.useEffect(() => {
    if (property) {
      setValue('status_string', property.status_string);
      setValue('transaction_type_string', property.transaction_type_string);
    }
  }, [property]);

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
    await axios(auth.access_token).patch('/api/asset/' + params.id, data);
    alert('Changed with success');
    // Reset the form errors
    clearErrors();
  };

  if (!isInitialized) {
    return <div>Loader...</div>;
  }

  const isRentFlow = property.transaction_type_string === 'Rent';

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant='h3'>{property.name}</Typography>
        <Typography variant='body2'>Description...</Typography>
        <Map address={address} />
      </Grid>

      <Grid item xs={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item md={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>Status</InputLabel>
                <Controller
                  name='status_string'
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {isRentFlow
                        ? Object.entries(StatusRent).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                              {value}
                            </MenuItem>
                          ))
                        : Object.entries(StatusSale).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} mb={1}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>Transaction type string</InputLabel>
                <Controller
                  name='transaction_type_string'
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value={'Sale'}>Sale</MenuItem>
                      <MenuItem value={'Auction'}>Auction</MenuItem>
                      <MenuItem value={'Tender'}>Tender</MenuItem>
                      <MenuItem value={'Rent'}>Rent</MenuItem>
                      <MenuItem value={'New Homes'}>New Homes</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} mt={1}>
              <Button type='submit'>Save</Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <Grid container mt={3}>
        {property.property_images.map((item: any, index: number) => {
          return (
            <Grid item md={4}>
              <img src={item.filename} height='200px' width='250px' />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
