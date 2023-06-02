import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { Grid, Box, Paper } from '@mui/material';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../utils/axios';
import { useGlobalState } from '../../../globalState';
import { CreatePropertyMap } from './CreatePropertyMap';
import { debounce } from 'lodash';
import {
  AssetTypeString,
  FeaturesEnum,
  MasterAssetTypeSring,
  PreferencesEnum,
  SPECIFIC_PROPERTY_FEATURES,
  StatusRent,
  StatusSale
} from '../property.interface';
import { SelectMultiple } from './SelectMultiple';
import { UploadImages } from './UploadImages';
import { FormControlledSelect } from './FormControlledSelect';

const firstFormSchema = yup.object().shape({
  transaction_type_string: yup.string().required('Transaction is required'),
  radius: yup.number()
});

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
  transaction_type_string: yup.string().required('Transaction Type is required'),
  master_asset_type_string: yup.string().required('Master Asset Type is required'),
  asset_type_string: yup.string().required('Asset Type is required'),
  currency_code: yup.string(),
  reserved: yup.boolean(),
  master_branch_name: yup.string(),
  preferences: yup.string(),
  property_features: yup.string()
});

const assetRentSchema = yup.object().shape({
  rental_amount: yup.number().nullable(),
  rental_frequency: yup.string(),
  deposit_amount: yup.number().nullable(),
  interest_by: yup.date(),
  available_from: yup.date()
});

const assetAttributeSchema = yup.object().shape({
  asset_attribute: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      type: yup.string(),
      value: yup.number().required('Is required')
    })
  ),
  floor_size: yup.string(),
  floor_size_unit: yup.string(),
  specific_property_features: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      value: yup.boolean()
    })
  ),
  property_images: yup
    .array()
    .of(
      yup.object().shape({
        originalName: yup.string(),
        filename: yup.string(),
        path: yup.string()
      })
    )
    .min(6)
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

const stepSchemas = [firstFormSchema, schema, assetAttributeSchema, assetRentSchema];

const DOCUMENT_TYPES: any[] = [
  {
    type: 'Employer reference',
    value: ''
  },
  {
    type: 'Landlord reference',
    value: ''
  },
  {
    type: 'Proof of ID',
    value: ''
  }
];

export const CreateProperty = (props: any) => {
  const { closeCreateScreen } = props;
  const [step, setStep] = useState(0);
  const [radios, setRadius] = useState<number>(0);
  const [mapDetails, setMapDetails] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const {
    user: [{ auth }]
  } = useGlobalState();

  React.useEffect(() => {
    getAttributes();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    getValues
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
        postal_town: 'Oxford',
        postal_code: 'OX1 1HS',
        administrative_area_level_1: 'England',
        country_code: 'GBR',
        text: ''
      },
      status_string: 'Draft',
      transaction_type_string: '',
      master_asset_type_string: 'Unknown',
      asset_type_string: 'Apartment',
      asset_rent: {
        rental_amount: '',
        rental_frequency: 'Month',
        deposit_amount: '',
        interest_by: '',
        available_from: ''
      },
      preferences: '',
      property_features: '',
      asset_attribute: attributes,
      floor_size: '',
      floor_size_unit: 'Feet Squared',
      specific_property_features: [],
      property_images: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'asset_attribute'
  });

  const getAttributes = async () => {
    const response = await axios(auth.access_token).get('/api/attribute');
    setValue('asset_attribute', response.data.docs);
    setAttributes(response.data.docs);
  };

  const onSubmit = async (data: any) => {
    console.log({ data });
    if (step === stepSchemas.length - 1) {
      data.asset_attribute = data.asset_attribute.map((item: any) => ({
        name: item.name,
        type: item.type,
        value: item.value
      }));
      const response = await axios(auth.access_token).post('/api/asset', data);
      closeCreateScreen();
    } else {
      setStep((currentStep) => currentStep + 1);
      // Reset the form errors
      clearErrors();
    }
  };

  // const debounceRequestInput = React.useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e),
  //   []
  // );

  const handleSearch = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const response = await axios(auth.access_token).get(
        '/api/map/address/' + e.target.value + '/radius/' + 1000
      );
      setMapDetails(response.data);
      setValue('asset_address.text', response.data.formatted_address);
      setValue('name', response.data.formatted_address);
    } catch (error: any) {
      throw new Error('Error on fetchind address');
    }
  }, 500);

  const transactionStatus = watch('transaction_type_string');
  const assetAddress = watch('asset_address');
  const values = getValues();

  const handleSelectChange = (propertyValues: any[]) => {
    setValue(
      'specific_property_features',
      // @ts-ignore
      propertyValues.map((item: string) => ({ name: item, value: true }))
    );
  };

  const handleImagesUpload = (images: any[]) => {
    // @ts-ignore
    setValue('property_images', images);
  };

  const watchPropertyFeatures = watch('specific_property_features');
  const isRentFlow = values.transaction_type_string === 'Rent';

  return (
    <Paper>
      <Box sx={{ width: '90%', marginLeft: '10rem', padding: '12px', marginTop: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <Grid container spacing={3} style={{ marginTop: '3rem', marginBottom: '3rem' }}>
              <Grid item xs={4}>
                <Button
                  onClick={() => setValue('transaction_type_string', 'Rent')}
                  style={{ backgroundColor: transactionStatus === 'Rent' ? 'green' : '' }}>
                  I’m looking for a tenant
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={() => setValue('transaction_type_string', 'Sale')}
                  style={{ backgroundColor: transactionStatus === 'Sale' ? 'green' : '' }}>
                  I’m looking for a buyer
                </Button>
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                  <TextField
                    label='Name'
                    variant='outlined'
                    {...register('name')}
                    error={!!errors?.name}
                    helperText={errors?.name?.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField
                    label='Radius'
                    type='number'
                    variant='outlined'
                    value={radios}
                    onChange={(e: any) => setRadius(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  {mapDetails && !assetAddress.latitude && (
                    <CreatePropertyMap mapDetails={mapDetails} setValue={setValue} />
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
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
                  <FormControlledSelect
                    control={control}
                    values={Object.entries(MasterAssetTypeSring)}
                    name='master_asset_type_string'
                    label='Master asset type'
                  />
                </Grid>
                <Grid item xs={4} mt={2}>
                  <FormControl fullWidth variant='outlined'>
                    <InputLabel>Property preferences</InputLabel>
                    <Controller
                      name='preferences'
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {Object.entries(PreferencesEnum).map(([key, value]) => {
                            return (
                              <MenuItem key={key} value={value}>
                                {value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4} mt={2}>
                  <FormControl fullWidth variant='outlined'>
                    <InputLabel>Property features</InputLabel>
                    <Controller
                      name='property_features'
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {Object.entries(FeaturesEnum).map(([key, value]) => {
                            return (
                              <MenuItem key={key} value={value}>
                                {value}
                              </MenuItem>
                            );
                          })}
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
                          {Object.entries(AssetTypeString).map(([key, value]) => {
                            return (
                              <MenuItem key={key} value={value}>
                                {value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}

          {step === 2 && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={4} md={4}>
                  <TextField
                    {...register('floor_size')}
                    error={!!errors?.floor_size}
                    helperText={errors?.floor_size?.message}
                    label='Floor size'
                    variant='outlined'
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                {fields.map((item, index) => {
                  return (
                    <Grid item xs={4} md={4} key={item.id}>
                      <Controller
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            {...field}
                            label={item.label}
                            required={item.required}
                          />
                        )}
                        name={`asset_attribute.${index}.value`}
                        control={control}
                      />
                      {/*  Display error */}
                    </Grid>
                  );
                })}
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <SelectMultiple
                    values={SPECIFIC_PROPERTY_FEATURES}
                    defaultValue={watchPropertyFeatures?.map((item: any) => item.name)}
                    onChange={(values: string[]) => handleSelectChange(values)}
                    label='Select property features'
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <UploadImages handleImagesUpload={handleImagesUpload} multiple={true} />
              </Grid>
            </>
          )}

          {step === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  {...register('asset_rent.rental_amount')}
                  error={!!errors?.asset_rent?.rental_amount}
                  helperText={errors?.asset_rent?.rental_amount?.message}
                  label='Rental amount'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register('asset_rent.rental_frequency')}
                  error={!!errors?.asset_rent?.rental_frequency}
                  helperText={errors?.asset_rent?.rental_frequency?.message}
                  label='Rent frequency'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register('asset_rent.deposit_amount')}
                  error={!!errors?.asset_rent?.deposit_amount}
                  helperText={errors?.asset_rent?.deposit_amount?.message}
                  label='Deposit amount'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register('asset_rent.interest_by')}
                  type='date'
                  error={!!errors?.asset_rent?.interest_by}
                  helperText={errors?.asset_rent?.interest_by?.message}
                  label='Interest by'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register('asset_rent.available_from')}
                  type='date'
                  error={!!errors?.asset_rent?.available_from}
                  helperText={errors?.asset_rent?.available_from?.message}
                  label='Available from'
                  variant='outlined'
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12}>
              {step > 0 ? (
                <Button onClick={() => setStep((prevStep: number) => prevStep - 1)}>Go back</Button>
              ) : null}
              <Button type='submit' variant='primary' color='primary' style={{ marginLeft: '10px' }}>
                {step === stepSchemas.length - 1 ? 'Submit' : 'Next step'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
};
