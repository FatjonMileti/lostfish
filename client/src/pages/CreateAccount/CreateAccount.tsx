import { styled } from '@mui/system';
import axios, { AxiosError } from 'axios';
import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavLink, useNavigate } from 'react-router-dom';

import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Backdrop } from '../../components/Backdrop';

import config from '../../config';
import { Header } from '../Login/Header';

import loginIllustration from '../Login/loginIllustration.png';
import { IconButton } from '../../components/IconButton';

const schema = yup.object().shape({
  firstName: yup.string().required('first name is required'),
  lastName: yup.string().required('last name is required'),
  email: yup.string().email().required('email is required'),
  password: yup.string().min(6).max(32).required()
});

export const CreateAccount = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const [confirmationEmailSent, setConfirmationEmailSent] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { firstName, lastName, email, password } = data;

    try {
      await axios.post(`${config.apiUrl}/api/user`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password
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
      <Header />
      <Backdrop open={loading}></Backdrop>
      <div className='container'>
        {/* {confirmationEmailSent && ( */}
        {/*   <div className='confirmation-email-sent'> */}
        {/*     <img src={emailSentIllustration} alt='' className='email-sent-illustration' /> */}
        {/*     <Typography variant='h3' className='confirmation-sent-title'> */}
        {/*       A confirmation email was sent to you. */}
        {/*     </Typography> */}
        {/*     <Typography variant='body4' className='description'> */}
        {/*       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut */}
        {/*       labore et dolore magna aliquaquis nostrud exercitation ullamco laboris nisi ut aliquip. */}
        {/*     </Typography> */}

        {/*     <div className='did-not-received-email'> */}
        {/*       <Typography variant='body4'>Didn’t receive the email?</Typography> */}
        {/*       <Link className='send-another-email-button' variant='body4' onClick={sendAnotherEmail}> */}
        {/*         Send another email */}
        {/*       </Link> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}
        <div className='left-part'>
          <Typography variant='h3' className='main-title'>
            Create an account
          </Typography>

          <div className='already-have-account'>
            <Typography variant='body4' className='already-in-lostfish'>
              Already have an account?
            </Typography>
            <Link variant='body4' onClick={() => navigate('/login')}>
              Login
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

              {/* <TextField */}
              {/*   label='Phone Number' */}
              {/*   className='phone-number-input' */}
              {/*   {...register('phoneNumber')} */}
              {/*   error={!!errors.phoneNumber} */}
              {/*   helperText={errors.phoneNumber?.message?.toString()} */}
              {/*   placeholder='Enter your phone number' */}
              {/* /> */}
            </div>

            <Button
              className='login-button'
              variant='contained'
              type='submit'
              disabled={!isValid}
              size='large'>
              Create Account
            </Button>

            <div className='policy-agreement-section'>
              <Typography variant='body5'>
                By continuing, you agree to Lostfish
                <NavLink to='/'> Privacy Policy </NavLink>
                and
                <NavLink to='/'> Terms of Service</NavLink>
              </Typography>
            </div>
          </form>
        </div>
        <div className='right-part'></div>
      </div>
    </div>
  );
})`
  &.create-account-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto;
    background-color: #ffffff;

    .container {
      display: grid;
      grid-template-columns: 440px minmax(746px, 50%);
      justify-content: space-between;
      padding: 24px 36px 26px 36px;
    }
  }

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
    padding: 32px 24px 40px 36px;
    box-shadow: 0 4px 48px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    height: max-content;
    max-width: 440px;

    .main-title {
    }

    .already-have-account {
      margin-top: 8px;
      display: flex;
      align-items: center;
      column-gap: 8px;

      .already-in-lostfish {
        color: #646464;
      }
    }

    .identity-providers {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
      .button {
        padding-inline: 28px;
        border-width: 2px;
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

    .form-fields {
      margin-top: 24px;
      display: grid;
      grid-template:
        'f l'
        'e e'
        'p p';

      row-gap: 28px;
      column-gap: 16px;

      max-width: 672px;

      .first-name-input {
        grid-area: f;
      }
      .last-name-input {
        grid-area: l;
      }

      .email-input {
        grid-area: e;
      }

      .password-input {
        grid-area: p;
      }
    }

    .login-button {
      margin-top: 24px;
      width: 100%;
    }

    .policy-agreement-section {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      .typography,
      a {
        color: #646464;
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
