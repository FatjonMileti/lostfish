import styled from '@emotion/styled';
import axios, { AxiosError } from 'axios';
import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';

import { registerStore, useGlobalState } from '../../globalState';

import config from '../../config';

import createAccountIllustration from './createAccountIllustration.png';

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required('email is required'),
  phoneNumber: yup.string()
});

export const CreateAccount = styled(({ className = '' }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { email, password } = data;

    try {
      const response = await axios.post(`${config.apiUrl}/api/account/login`, {
        email,
        password
      });
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
    <div className={`create-account-page ${className}`}>
      <div className='left-part'>
        <Typography variant='h3' className='main-title'>
          Join our community.
        </Typography>

        <form
        // onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore aliqua.
          </Typography>

          <div className='form-fields'>
            <TextField
              label='First Name'
              className='first-name-input'
              required
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message?.toString()}
              placeholder='Enter your first name'
            />
            <TextField
              label='Last Name'
              className='last-name-input'
              required
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message?.toString()}
              placeholder='Enter your last name'
            />
            <TextField
              label='Email'
              className='email-input'
              required
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
              placeholder='Enter your email'
            />

            <TextField
              label='Phone Number'
              className='phone-number-input'
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message?.toString()}
              placeholder='Enter your phone number'
            />
          </div>

          <div>
            <div className='policy-agreement-section keep-me-signed-in-section'>
              <label className='switch-label'>
                {/*<Switch*/}
                {/*// checked={user.rememberMe}*/}
                {/*// onChange={({ target: { checked } }) => setRememberMe(checked)}*/}
                {/*/>*/}
                <input type='checkbox' />
                <Typography variant='body5'>
                  I agree to have my data processed as stated in the Privacy Policy
                </Typography>
              </label>

              <Link variant='body4' underline='always'>
                Privacy Policy
              </Link>
            </div>
            <Button
              className='login-button'
              variant='contained'
              endIcon={<Icon icon='arrow-right' color='white' />}
              type='submit'
              disabled={!isValid}
              size='large'>
              Create Account
            </Button>
          </div>

          <div className='dont-have-account'>
            <Typography variant='body4'>Have an account?</Typography>
            <Link variant='body4' onClick={() => navigate('/login')}>
              Sign in instead
            </Link>
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
  grid-template-columns: 59fr 41fr;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);

  .left-part {
    padding-left: 36px;
    padding-right: 24px;
    padding-bottom: 44px;

    .main-title {
      margin-top: 176px;
    }

    .description {
      margin-top: 24px;
      max-width: 440px;
    }

    .form-fields {
      margin-top: 64px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;

      max-width: 672px;

      .email-input {
      }
    }

    .policy-agreement-section {
      margin-top: 16px;
      display: flex;
      align-items: center;
      grid-template-columns: auto auto;

      column-gap: 34px;

      .switch-label {
        display: flex;
        column-gap: 34px;
        align-items: center;
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

  .right-part {
    background-image: url(${createAccountIllustration});
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
  }
`;
