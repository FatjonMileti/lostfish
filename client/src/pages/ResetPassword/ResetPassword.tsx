import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Header } from '../Login/Header';
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import config from '../../config';
import * as yup from 'yup';

import loginIllustration from '../Login/loginIllustration.png';

import { useUserStore } from '../../globalState/user';
import { strongPasswordValidator } from '../../utils/validation.helper';

const schema = yup.object().shape({
  password: strongPasswordValidator,
  'repeat-password': yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password repetition is required')
});

export const ResetPassword = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const setUser = useUserStore((user) => user.set);

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = async (data: any) => {
    setLoading(true);

    const { password } = data;
    const token = params?.token;

    try {
      const response = await axios.post(`${config.apiUrl}/api/user/reset-password`, {
        password,
        token
      });

      const userDetails = JSON.parse(window.atob(response.data.access_token.split('.')[1]));
      setUser((user: any) => ({ ...user, auth: response.data, userDetails }));

      navigate('/');
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_not_found') {
        return setError('password', { message: 'User not found!', type: 'server' });
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
    <div className={`reset-password-page ${className}`}>
      <Header />
      <Backdrop open={loading}></Backdrop>
      <div className='container'>
        <div className='left-part'>
          <Typography variant='body2' className='main-title'>
            Reset password?
          </Typography>

          <Typography variant='body4' className='description'>
            No problem! Just enter the email address that you signed up with to reset it.
          </Typography>

          <form className='content' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-fields'>
              <TextField
                label='Password'
                className='password-input'
                required
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message?.toString()}
                placeholder='Enter your new password'
                type='password'
              />

              <TextField
                label='Repeat password'
                className='reset-password-input'
                required
                {...register('repeat-password')}
                error={!!errors['repeat-password']}
                helperText={errors['repeat-password']?.message?.toString()}
                placeholder='Repeat your new password'
                type='password'
              />
            </div>

            <Button className='login-button' type='submit' disabled={!isValid} size='large'>
              Reset
            </Button>
          </form>
        </div>

        <div className='right-part'></div>
      </div>
    </div>
  );
})`
  &.reset-password-page {
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

    .left-part {
      padding: 32px 24px 40px 36px;
      box-shadow: 0 4px 48px rgba(0, 0, 0, 0.04);
      border-radius: 16px;
      height: max-content;
      max-width: 440px;

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
  }
`;
