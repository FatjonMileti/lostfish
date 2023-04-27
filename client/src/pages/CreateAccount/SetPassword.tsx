import React from 'react';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

import { IconButton } from '../../components/IconButton';
import setPasswordIllustration from './setPasswordIllustration.png';

import config from '../../config';
import { registerStore, useGlobalState } from '../../globalState';

const schema = yup.object().shape({
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'passwords must match')
});

registerStore(
  'user',
  {
    rememberMe: false,
    auth: null,
    userDetails: null
  },
  { persist: true }
);

export const SetPassword = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const {
    user: [user, setUser]
  } = useGlobalState();

  const [showPassword, setShowPassword] = React.useState(false);
  const [userData, setUserData] = React.useState<null | { first_name: string }>(null);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userData) {
      axios.get(`${config.apiUrl}/api/user/invitation/${params.token}`).then((response) => {
        console.log('response user data: ', response);
        setUserData(response.data);
      });
    }
  }, [params]);

  const onSubmit = async (data: any) => {
    const { password } = data;
    const token = params.token;

    try {
      const response = await axios.put(`${config.apiUrl}/api/user/invitation`, {
        token,
        password
      });

      const userDetails = JSON.parse(window.atob(response.data.access_token.split('.')[1]));

      setUser((user: any) => ({ ...user, auth: response.data, userDetails }));
      navigate('/');
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_not_found') {
        return setError('email', { message: 'user not found!', type: 'server' });
      }

      throw err;
    }
  };

  return (
    <div className={`set-password ${className}`}>
      <div className='left-part'>
        <Typography variant='h3' className='main-title'>
          Welcome, {userData?.first_name || ''}
        </Typography>

        <form className='content' onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore aliqua.
          </Typography>
          <div>
            <TextField
              type={showPassword ? 'text' : 'password'}
              label='Password'
              className='password-input'
              required
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
              endAdornment={
                <IconButton style={{ border: 'none' }} onClick={() => setShowPassword((show) => !show)}>
                  {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
                </IconButton>
              }
            />

            <TextField
              type={showPassword ? 'text' : 'password'}
              label='Confirm password'
              className='password-input'
              required
              {...register('confirmPassword')}
              endAdornment={
                <IconButton style={{ border: 'none' }} onClick={() => setShowPassword((show) => !show)}>
                  {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
                </IconButton>
              }
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message?.toString()}
            />
            <Button
              className='login-button'
              variant='contained'
              endIcon={<Icon icon='arrow-right' color='white' />}
              type='submit'
              disabled={!isValid}
              size='large'>
              Set password
            </Button>
          </div>
        </form>
      </div>
      <div className='right-part'></div>
    </div>
  );
})`
  max-width: 1440px;
  margin-inline: auto;

  display: grid;
  grid-template-columns: 43fr 57fr;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);

  .left-part {
    padding-left: 36px;
    padding-right: 24px;
    padding-bottom: 44px;

    .main-title {
      margin-top: 176px;
    }

    .content {
      max-width: 440px;

      .description {
        margin-top: 24px;
      }

      .email-input {
        margin-top: 64px;
      }

      .password-input {
        margin-top: 24px;
      }

      .login-button {
        margin-top: 48px;
        text-transform: none;
      }
    }
  }

  .right-part {
    background-image: url(${setPasswordIllustration});
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
  }
`;
