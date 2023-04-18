import styled from '@emotion/styled';
import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

import loginIllustration from './loginIllustration.svg';
import { Link } from '../../components/Link';
import { Switch } from '../../components/Switch';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton } from '../../components/IconButton';
import React from 'react';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(32).required()
});

export const Login = styled(({ className = '' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data: any) => console.log(data);

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
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
              {...register('email')}
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
              <Typography variant='body4'>Keep me signed in</Typography>
              <Switch />
              <Link>Reset password</Link>
            </div>
            <Button
              className='login-button'
              variant='contained'
              endIcon={<Icon icon='arrow-right' color='white' />}
              type='submit'
              disabled={!isValid}>
              Sign in
            </Button>
          </div>
          <div className='dont-have-account'>
            <Typography variant='body4'>Don’t have an account?</Typography>
            <Link>Reset password</Link>
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
        grid-template-columns: auto auto auto;

        .link {
          justify-self: flex-end;
        }
      }

      .login-button {
        margin-top: 48px;
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
