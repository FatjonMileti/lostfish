import { styled } from '@mui/system';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Modal, ModalProps } from '../../components/Modal';
import { ShowGlobalLoading } from '../../components/ShowGlobalLoading';

import { strongPasswordValidator } from '../../utils/validation.helper';
import { useUserStore } from '../../globalState/user';
import config from '../../config';
import classNames from 'classnames';
import { CloseButton } from '../../components/CloseButton';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';

const schema = yup.object().shape({
  password: strongPasswordValidator,
  'repeat-password': yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password repetition is required')
});

interface ResetPasswordModalProps extends ModalProps {}

export const ResetPasswordModal = styled(({ className }: ResetPasswordModalProps) => {
  const [showResetPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const setUser = useUserStore((user) => user.set);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const form = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const resetPasswordToken = new URLSearchParams(useLocation().search).get('resetPasswordToken');

  React.useEffect(() => {
    if (resetPasswordToken) {
      setShowPasswordModal(true);
      console.log('setShowPasswordModal');
    }
  }, [resetPasswordToken]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    const { password } = data;
    const token = resetPasswordToken;

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
        return form.setError('password', { message: 'User not found!', type: 'server' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <ShowGlobalLoading />}
      <Modal
        open={showResetPasswordModal}
        className={classNames('reset-password-modal', className)}
        onBackdropClick={() => setShowPasswordModal(false)}>
        <div className='modal-header'>
          <Typography variant='body3' className='title'>
            Reset your password
          </Typography>
          <CloseButton
            inverted={false}
            background={true}
            size='large'
            onClick={() => setShowPasswordModal(false)}
          />
        </div>

        <div className='container'>
          <Typography variant='body4' className='description'>
            No problem! Just enter the email address that you signed up with to reset it.
          </Typography>

          <form className='content'>
            <div className='form-fields'>
              <TextField
                label='Password'
                className='password-input'
                required
                {...form.register('password')}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message?.toString()}
                placeholder='Enter your new password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <IconButton
                    noBackground
                    style={{ color: '#184d6d' }}
                    onClick={() => setShowPassword((show) => !show)}>
                    {<Icon icon={showPassword ? 'eye-invisible' : 'eye'} />}
                  </IconButton>
                }
              />

              <TextField
                label='Repeat password'
                className='reset-password-input'
                required
                {...form.register('repeat-password')}
                error={!!form.formState.errors['repeat-password']}
                helperText={form.formState.errors['repeat-password']?.message?.toString()}
                placeholder='Repeat your new password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <IconButton
                    noBackground
                    style={{ color: '#184d6d' }}
                    onClick={() => setShowPassword((show) => !show)}>
                    {<Icon icon={showPassword ? 'eye-invisible' : 'eye'} />}
                  </IconButton>
                }
              />
            </div>
          </form>

          <Button
            className='reset-password-button'
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid}
            size='large'>
            Reset
          </Button>
        </div>
      </Modal>
    </>
  );
})`
  &.reset-password-modal {
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100%;
    width: 440px;
    display: grid;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-family: At Gambit, serif;
      }
    }

    .container {
      display: grid;
      row-gap: 24px;

      .form-fields {
        display: grid;
        row-gap: 24px;
        column-gap: 16px;
      }

      .reset-password-button {
        width: 100%;
      }
    }
  }
`;
