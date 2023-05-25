import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../utils/axios';
import { useGlobalState } from '../../../globalState';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  asset_address: yup.object().shape({
    latitude: yup.number().min(-90).max(90).required('required'),
    longitude: yup.number().min(-180).max(180).required('required'),
    street_number: yup.string(),
    route: yup.string(),
    neighbourhood: yup.string(),
    postal_town: yup.string(),
    postal_code: yup.string().required('required'),
    administrative_area_level_1: yup.string(),
    country_code: yup.string().required('required'),
    text: yup.string()
  }),
  status_string: yup.string().required('Status is required'),
  transaction_type_string: yup.string().required('Transaction Type is required'),
  master_asset_type_string: yup.string().required('Master Asset Type is required'),
  asset_type_string: yup.string().required('Asset Type is required'),
  currency_code: yup.string(),
  reserved: yup.boolean(),
  master_branch_name: yup.string()
});

const assetRentSchema = yup.object().shape({
  rental_amount: yup.number(),
  rental_frequency: yup.string(),
  deposit_amount: yup.number(),
  interest_by: yup.date(),
  available_from: yup.date(),
  postal_town: yup.string()
});

const assetSaleSchema = yup.object().shape({
  asking_price: yup.number().required(),
  minimum_offer: yup.number(),
  offer_increment_amount: yup.number(),
  date_go_live: yup.date(),
  date_offer_deadline: yup.date(),
  date_exchanged: yup.string(),
  date_completion: yup.date(),
  contract_deposit_percent: yup.number(),
  booking_deposit_amount: yup.number(),
  special_conditions: yup.string(),
  show_all_offers: yup.boolean(),
  show_highest_offer: yup.boolean(),
  enable_downward_bidding: yup.boolean(),
  downward_bidding_allowed_percentage: yup.number(),
  asset_fee: yup.object().shape({
    fee_calculation: yup.string(),
    simple_commission_percent: yup.number(),
    minimum_commission_amount: yup.number(),
    fixed_fee_amount: yup.number(),
    conditional_bands: yup.array().of(
      yup.object().shape({
        starting: yup.number(),
        ending: yup.number(),
        total_commission: yup.number()
      })
    )
  })
});

const stepSchemas = [schema, assetRentSchema, assetSaleSchema];

export const CreateProperty = () => {
  const [step, setStep] = useState(0);

  const {
    user: [{ auth }]
  } = useGlobalState();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm({
    resolver: yupResolver(stepSchemas[step]),
    defaultValues: {
      name: '',
      description: '',
      asset_address: {
        latitude: '',
        longitude: '',
        street_number: '',
        route: '',
        neighbourhood: '',
        postal_town: '',
        postal_code: '123456',
        administrative_area_level_1: '',
        country_code: 'US',
        text: ''
      },
      status_string: 'Draft',
      transaction_type_string: 'Rent',
      master_asset_type_string: 'Unknown',
      asset_type_string: 'Apartment'
    }
  });
  const onSubmit = async (data: any) => {
    if (step === stepSchemas.length - 1) {
      const response = await axios(auth.access_token).post('/api/asset', data);
      console.log({ response: response.data });
    } else {
      setStep((currentStep) => currentStep + 1);
      // Reset the form errors
      clearErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            {...register('name')}
            error={!!errors.name}
            helperText={errors?.name?.message}
            label='Name'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('description')}
            error={!!errors.description}
            helperText={errors?.description?.message}
            label='Description'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.latitude')}
            error={!!errors.asset_address?.latitude}
            helperText={errors?.asset_address?.latitude?.message}
            label='Latitude'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.longitude')}
            error={!!errors.asset_address?.longitude}
            helperText={errors?.asset_address?.longitude?.message}
            label='Longitude'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.street_number')}
            error={!!errors.asset_address?.street_number}
            helperText={errors?.asset_address?.street_number?.message}
            label='Street number'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.route')}
            error={!!errors.asset_address?.route}
            helperText={errors?.asset_address?.route?.message}
            label='Route'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.postal_code')}
            error={!!errors.asset_address?.postal_code}
            helperText={errors?.asset_address?.postal_code?.message}
            label='Postal code'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            {...register('asset_address.text')}
            error={!!errors.asset_address?.text}
            helperText={errors?.asset_address?.text?.message}
            label='Address free text'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4} mt={2}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Status</InputLabel>
            <Controller
              name='status_string'
              control={control}
              defaultValue='Draft'
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value={'Draft'}>Draft</MenuItem>
                  <MenuItem value={'Live'}>Live</MenuItem>
                  <MenuItem value={'Sale Agreed'}>Sale Agreed</MenuItem>
                  <MenuItem value={'Exchanged'}>Exchanged</MenuItem>
                  <MenuItem value={'Completed'}>Completed</MenuItem>
                  <MenuItem value={'Archived'}>Archived</MenuItem>
                  <MenuItem value={'Pre Draft'}>Pre Draft</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} mt={2}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Transaction type string</InputLabel>
            <Controller
              name='transaction_type_string'
              control={control}
              defaultValue='Rent'
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
        <Grid item xs={4} mt={2}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Master asset type</InputLabel>
            <Controller
              name='master_asset_type_string'
              control={control}
              defaultValue='Unknown'
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value={'Unknown'}>Unknown</MenuItem>
                  <MenuItem value={'Residential'}>Residential</MenuItem>
                  <MenuItem value={'Commercial'}>Commercial</MenuItem>
                  <MenuItem value={'Marine'}>Marine</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} mt={2}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Asset type string</InputLabel>
            <Controller
              name='asset_type_string'
              control={control}
              defaultValue='Unknown'
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value={'Unknown'}>Unknown</MenuItem>
                  <MenuItem value={'Studio Apartment'}>Studio Apartment</MenuItem>
                  <MenuItem value={'Duplex Apartmen'}>Duplex Apartmen</MenuItem>
                  <MenuItem value={'Industrial'}>Industrial</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        {/* Repeat for the rest of your fields, replacing the relevant names and labels */}
        <Grid item xs={12}>
          <Button type='submit' variant='contained' color='primary'>
            {step === stepSchemas.length - 1 ? 'Submit' : 'Next step'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
