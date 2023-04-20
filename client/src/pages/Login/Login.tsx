import React from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { registerStore, useGlobalState } from '../../globalState';

import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { Switch } from '../../components/Switch';
import { IconButton } from '../../components/IconButton';
import loginIllustration from './loginIllustration.svg';

import config from '../../config';

const schema = yup.object().shape({
  email: yup.string().email().required('email is required'),
  password: yup.string().min(6).max(32).required()
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

export const Login = styled(({ className = '' }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    user: [user, setUser]
  } = useGlobalState();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!!user.auth) navigate('/');
  }, [user.auth]);

  const setRememberMe = (rememberMe: boolean) => {
    setUser((user: any) => ({ ...user, rememberMe }));
  };

  const onSubmit = async (data: any) => {
    const { email, password } = data;

    try {
      const response = await axios.post(`${config.apiUrl}/api/account/login`, {
        email,
        password
      });

      const userDetails = JSON.parse(window.atob(response.data.access_token.split('.')[1]));

      setUser((user: any) => ({ ...user, auth: response.data, userDetails }));

      console.log(response.data);
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_not_found') {
        return setError('email', { message: 'user not found!', type: 'server' });
      }

      if (message === 'incorrect_password') {
        return setError('password', { message: 'incorrect password', type: 'server' });
      }

      throw err;
    }
  };

  return (
    <div className={`login-page ${className}`}>
      <div className='left-part'>
        <Typography variant='h3' className='main-title'>
          See what’s in it for you.
        </Typography>

        <form className='content' onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore aliqua.
          </Typography>
          <div>
            <TextField
              label='Email'
              className='email-input'
              required
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
            />

            <TextField
              type={showPassword ? 'text' : 'password'}
              label='Password'
              className='password-input'
              required
              {...register('password')}
              endAdornment={
                <IconButton style={{ border: 'none' }} onClick={() => setShowPassword((show) => !show)}>
                  {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
                </IconButton>
              }
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
            />
            <div className='keep-me-signed-in-section'>
              <label className='switch-label'>
                <Typography variant='body4'>Keep me signed in</Typography>
                <Switch
                  checked={user.rememberMe}
                  onChange={({ target: { checked } }) => setRememberMe(checked)}
                />
              </label>

              <Link variant='body4'>Reset password</Link>
            </div>
            <Button
              className='login-button'
              variant='contained'
              endIcon={<Icon icon='arrow-right' color='white' />}
              type='submit'
              disabled={!isValid}
              size='large'>
              Sign in
            </Button>
          </div>
          <div className='dont-have-account'>
            <Typography variant='body4'>Don’t have an account?</Typography>
            <Link variant='body4'>Create one now</Link>
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

      .keep-me-signed-in-section {
        margin-top: 16px;
        display: grid;
        align-items: center;
        grid-template-columns: auto auto;
        column-gap: 34px;
        .switch-label {
          display: flex;
          column-gap: 34px;
          align-items: center;
        }

        .link {
          justify-self: flex-end;
        }
      }

      .login-button {
        margin-top: 48px;
        text-transform: none;
      }

      .dont-have-account {
        margin-top: 112px;
        display: flex;
        align-items: center;
        column-gap: 8px;
      }
    }
  }

  .right-part {
    background-image: url(${loginIllustration});
    background-repeat: no-repeat;
    background-size: cover;
    background-color: white;
  }
`;
