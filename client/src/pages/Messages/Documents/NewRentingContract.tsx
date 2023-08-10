import React, { useState } from 'react';

import { Button } from '../../../components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AxiosError } from 'axios';
import axios from '../../../utils/axios';
import config from '../../../config';

import { useProfileStore } from '../../../globalState/profile';
import { useUserStore } from '../../../globalState/user';

import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const schema = yup.object().shape({
  landlord: yup.string().required('Landlord is required'),
  tenant: yup.string().required('Tenant is required'),
  property_id: yup.string().required('Property is required')
});

interface INewRentingContract {
  tenant: string;
  onFinish: () => void;
}

export const NewRentingContract = (props: INewRentingContract) => {
  const [loading, setLoading] = React.useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const profileStore = useProfileStore();

  const { auth } = useUserStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    setValue
  } = useForm({
    defaultValues: {
      tenant: '',
      landlord: '',
      property_id: ''
    },
    resolver: yupResolver(schema),
    mode: 'all'
  });

  React.useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    try {
      const { data } = await axios(auth.access_token).get('/api/asset', {
        params: {
          pageSize: 100
        }
      });

      setProperties(data.docs);
    } catch (error: AxiosError | any) {
      //handle error
    }
  };

  React.useEffect(() => {
    if (profileStore) {
      setValue('landlord', `${profileStore.id}`);
    }
    setValue('tenant', `${props.tenant}`);
  }, [props]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { tenant, property_id, landlord } = data;

    try {
      await axios(auth.access_token).post(`${config.apiUrl}/api/docusign/create-envelope`, {
        tenant,
        landlord,
        property_id
      });
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'tenant dont exist') {
        return setError('tenant', { message: 'tenant is not verified!', type: 'server' });
      }

      throw err;
    } finally {
      setLoading(false);
      props.onFinish();
    }
  };
  return (
    <form className='content' onSubmit={handleSubmit(onSubmit)}>
      <div className='form-fields'>
        <FormControl fullWidth>
          <FormLabel id='demo-simple-select-label-property'>Choose Property</FormLabel>
          <Select
            labelId='demo-simple-select-label-property'
            id='demo-simple-select-property'
            {...register('property_id')}
            error={!!errors.property_id}
            size='small'>
            {properties.map((property: any) => {
              return (
                <MenuItem value={property._id} key={property._id}>
                  {`${property.area_of_interest}`}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{errors.property_id?.message?.toString()}</FormHelperText>
        </FormControl>
      </div>
      <Button
        className='login-button'
        type='submit'
        disabled={!isValid}
        size='large'
        style={{ marginTop: '2rem' }}>
        Generate contract
      </Button>
    </form>
  );
};
