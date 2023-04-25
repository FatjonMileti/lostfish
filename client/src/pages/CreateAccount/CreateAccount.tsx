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
import { Checkbox } from '../../components/Checkbox';
import { Backdrop } from '../../components/Backdrop';

import config from '../../config';

import createAccountIllustration from './createAccountIllustration.png';
import emailSentIllustration from './emailSentIllustration.png';

const schema = yup.object().shape({
  firstName: yup.string().required('first name is required'),
  lastName: yup.string().required('last name is required'),
  email: yup.string().email().required('email is required'),
  phoneNumber: yup.string(),
  privacyPolicy: yup.boolean().oneOf([true])
});

export const CreateAccount = styled(({ className = '' }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const [confirmationEmailSent, setConfirmationEmailSent] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { firstName, lastName, email, phoneNumber } = data;

    try {
      await axios.post(`${config.apiUrl}/api/user`, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phoneNumber
      });

      setConfirmationEmailSent(true);
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_already_exists') {
        return setError('email', { message: 'user already registered!', type: 'server' });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendAnotherEmail = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    setLoading(false);
  };

  return (
    <div className={`create-account-page ${className} ${confirmationEmailSent ? 'email-sent' : ''}`}>
      <Backdrop open={loading}></Backdrop>
      {confirmationEmailSent && (
        <div className='confirmation-email-sent'>
          <img src={emailSentIllustration} alt='' className='email-sent-illustration' />
          <Typography variant='h3' className='confirmation-sent-title'>
            A confirmation email was sent to you.
          </Typography>
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliquaquis nostrud exercitation ullamco laboris nisi ut aliquip.
          </Typography>

          <div className='did-not-received-email'>
            <Typography variant='body4'>Didn’t receive the email?</Typography>
            <Link className='send-another-email-button' variant='body4' onClick={sendAnotherEmail}>
              Send another email
            </Link>
          </div>
        </div>
      )}
      <div className='left-part'>
        <Typography variant='h3' className='main-title'>
          Join our community.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                <Checkbox {...register('privacyPolicy')} />
                <Typography variant='body5'>I agree to have my data processed as stated in the</Typography>
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

  &.email-sent {
    grid-template-columns: 1fr;
    .left-part,
    .right-part {
      display: none;
    }
  }

  .confirmation-email-sent {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-content: center;

    .email-sent-illustration {
      mix-blend-mode: multiply;
      height: 195px;
    }

    .confirmation-sent-title {
      margin-top: 32px;
      max-width: 904px;
      text-align: center;
    }

    .description {
      margin-top: 24px;
      max-width: 672px;
      text-align: center;
    }

    .did-not-received-email {
      margin-top: 227px;
      display: flex;
      column-gap: 8px;

      color: #a7a7a7;

      .send-another-email-button {
        //text-transform: none;
        font-weight: 600;
      }
    }
  }

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
      column-gap: 8px;

      .switch-label {
        display: flex;
        column-gap: 12px;
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
