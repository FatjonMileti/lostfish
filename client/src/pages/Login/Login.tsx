import React from 'react';
import { styled } from '@mui/system';
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

import config from '../../config';
import { Backdrop } from '../../components/Backdrop';
import { Header } from './Header';

import loginIllustration from './loginIllustration.png';

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

export const Login = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
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

  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!!user.auth) navigate('/');
  }, [user.auth]);

  const setRememberMe = (rememberMe: boolean) => {
    setUser((user: any) => ({ ...user, rememberMe }));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${className}`}>
      <Header />
      <Backdrop open={loading}></Backdrop>
      <div className='container'>
        <div className='left-part'>
          <Typography variant='h3' className='main-title'>
            Log in
          </Typography>

          <div className='dont-have-account'>
            <Typography variant='body4' className='new-to-lostfish'>
              New to Lostfish?
            </Typography>
            <Link variant='body4' onClick={() => navigate('/create-account')}>
              Create account
            </Link>
          </div>

          <div className='identity-providers'>
            <Button variant='secondary'>
              <Icon icon='apple' />
            </Button>
            <Button variant='secondary'>
              <Icon icon='facebook' />
            </Button>
            <Button variant='secondary'>
              <Icon icon='twitter' />
            </Button>
            <Button variant='secondary'>
              <Icon icon='google' />
            </Button>
          </div>

          <div className='or-line'>
            <span />
            <Typography variant='body5'>OR</Typography>
            <span />
          </div>

          <form className='content' onSubmit={handleSubmit(onSubmit)}>
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
                  <IconButton
                    noBackground
                    style={{ color: '#184d6d' }}
                    onClick={() => setShowPassword((show) => !show)}>
                    {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
                  </IconButton>
                }
                error={!!errors.password}
                helperText={errors.password?.message?.toString()}
              />

              <Button
                className='login-button'
                variant='contained'
                type='submit'
                disabled={!isValid}
                size='large'>
                Sign in
              </Button>

              <div className='keep-me-signed-in-section'>
                <Typography variant='body4'>Forgot your password?</Typography>
                <Link variant='body4'>Reset password</Link>
              </div>
            </div>
          </form>
        </div>
        <div className='right-part'></div>
      </div>
    </div>
  );
})`
  &.login-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto;
    background-color: #ffffff;
  }

  .container {
    display: grid;
    grid-template-columns: 440px minmax(746px, 50%);
    justify-content: space-between;
    padding: 24px 36px 26px 36px;
  }

  .left-part {
    padding: 32px 24px 40px 36px;
    box-shadow: 0 4px 48px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    height: max-content;
    max-width: 440px;

    .main-title {
    }

    .dont-have-account {
      margin-top: 8px;
      display: flex;
      align-items: center;
      column-gap: 8px;

      .new-to-lostfish {
        color: #646464;
      }
    }

    .identity-providers {
      margin-top: 32px;
      display: flex;
      column-gap: 16px;
      justify-content: space-between;
      .button {
        padding-inline: 28px;
      }
    }

    .or-line {
      display: grid;
      grid-template-columns: auto min-content auto;
      column-gap: 16px;
      align-items: center;
      margin-top: 24px;
      .typography {
        color: #a7a7a7;
      }

      span {
        height: 2px;
        background-color: #e7e7e7;
      }
    }

    .content {
      margin-top: 24px;
      .description {
        margin-top: 24px;
      }

      .email-input {
      }

      .password-input {
        margin-top: 24px;
      }

      .keep-me-signed-in-section {
        margin-top: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        column-gap: 8px;
      }

      .login-button {
        margin-top: 36px;
        width: 100%;
      }
    }
  }

  .right-part {
    background-image: url(${loginIllustration});
    background-repeat: no-repeat;
    background-size: auto;
    background-color: white;
    background-position: center;
  }
`;
