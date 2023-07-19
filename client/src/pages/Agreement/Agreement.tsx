import React from 'react';
import { styled } from '@mui/system';

import { Header } from '../Home/Header';
import { TextField } from '../../components/TextField';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import config from '../../config';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { useProfileStore } from '../../globalState/profile';
import { useUserStore } from '../../globalState/user';
import { Envelopes } from './scenes/Envelopes';
const schema = yup.object().shape({
  fullName: yup.string().required('fullname is required'),
  tenant: yup.string().required('Tenant is required')
});

export const Agreement = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState(false);

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
      fullName: '',
      tenant: ''
    },
    resolver: yupResolver(schema),
    mode: 'all'
  });

  React.useEffect(() => {
    if (profileStore) {
      setValue('fullName', `${profileStore.first_name} ${profileStore.last_name}`);
    }
  }, [profileStore]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { tenant } = data;

    try {
      await axios(auth.access_token).post(`${config.apiUrl}/api/docusign/form`, {
        tenant
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
    }
  };
  return (
    <div className={`home-page ${className}`}>
      <Header />

      <div className='container'>
        <div className='content'>
          <Box ml='5rem'>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <form className='content' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-fields'>
                    <TextField
                      label='Your fullname'
                      className='first-name-input'
                      required
                      {...register('fullName')}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message?.toString()}
                      placeholder='Your name'
                      disabled
                    />
                    <TextField
                      label='Tenant'
                      className='last-name-input'
                      required
                      {...register('tenant')}
                      error={!!errors.tenant}
                      helperText={errors.tenant?.message?.toString()}
                      placeholder='Enter tenant id'
                    />
                  </div>
                  <Button
                    className='login-button'
                    type='submit'
                    disabled={!isValid}
                    size='large'
                    style={{ marginTop: '2rem' }}>
                    Generate agreement
                  </Button>
                </form>
              </Grid>
              <Grid item xs={5}>
                <Envelopes />
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    background-color: #f7f1e7;

    grid-template-rows: min-content auto;

    .header {
      z-index: 1;
    }
  }
`;
