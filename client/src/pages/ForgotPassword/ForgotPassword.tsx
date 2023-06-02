import { styled } from '@mui/system';
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
import { Backdrop } from '../../components/Backdrop';

import config from '../../config';
import { Header } from '../Login/Header';

import loginIllustration from '../Login/loginIllustration.png';

const schema = yup.object().shape({
  email: yup.string().email().required('email is required')
});

export const ForgotPassword = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
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
    const { email } = data;

    try {
      await axios.post(`${config.apiUrl}/api/user/forgot-password`, {
        email
      });

      setConfirmationEmailSent(true);
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_not_found') {
        return setError('email', { message: 'User not found!', type: 'server' });
      }
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
        <div className='confirmation-email-sent'>
          <Typography variant='body2' className='confirmation-sent-title'>
            Verify your email
          </Typography>
          <Typography variant='body4' className='description'>
            We’ve sent you an email to verify that your account has a valid email address. Follow the
            instructions sent to you to recover your account.
          </Typography>

          <Button className='sign-in-button' onClick={() => navigate('/login')}>
            Sign In
          </Button>

          <div className='did-not-received-email'>
            <Typography variant='body4'>Didn’t receive it?</Typography>
            <Link className='send-another-email-button' variant='body4' onClick={sendAnotherEmail}>
              Send another email
            </Link>
          </div>
        </div>

        <div className='left-part'>
          <Link variant='body4' onClick={() => navigate('/login')} className='back-to-login'>
            <Icon icon='arrow-left-1' size={12} />
            Back
          </Link>
          <Typography variant='body2' className='main-title'>
            Forgot your password?
          </Typography>

          <Typography variant='body4' className='description'>
            No problem! Just enter the email address that you signed up with to reset it.
          </Typography>

          <form className='content' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-fields'>
              <TextField
                label='Email'
                className='email-input'
                required
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message?.toString()}
                placeholder='Enter your email'
              />
            </div>

            <Button className='login-button' type='submit' disabled={!isValid} size='large'>
              Send reset instructions
            </Button>
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
    .left-part {
      display: none;
    }

    .confirmation-email-sent {
      display: grid;
    }
  }

  .confirmation-email-sent {
    display: none;
    padding: 32px 24px 40px 36px;
    box-shadow: 0 4px 48px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    height: max-content;
    max-width: 440px;

    .confirmation-sent-title {
    }

    .description {
      margin-top: 16px;
    }

    .sign-in-button {
      margin-top: 24px;
      width: 100%;
    }

    .did-not-received-email {
      margin-top: 32px;
      display: flex;
      column-gap: 8px;
      justify-content: center;

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

    .back-to-login {
      .typography {
        display: flex;
        column-gap: 14px;
        align-items: center;
      }
    }

    .main-title {
      margin-top: 32px;
    }

    .description {
      margin-top: 16px;
    }

    .form-fields {
      margin-top: 24px;
      display: grid;

      row-gap: 28px;
      column-gap: 16px;
      max-width: 672px;

      .email-input {
      }
    }

    .login-button {
      margin-top: 36px;
      width: 100%;
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
