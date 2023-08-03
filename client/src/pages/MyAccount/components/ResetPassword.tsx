import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { styled } from '@mui/system';
import { strongPasswordValidator } from '../../../utils/validation.helper';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: strongPasswordValidator,
  confirmPassword: yup.string().required('Confirmation is required')
});

interface IResetPassword {
  setResetPass: React.Dispatch<React.SetStateAction<boolean>>;
  className?: React.HTMLAttributes<HTMLDivElement>;
}

export const ResetPassword = styled(({ className, setResetPass }: IResetPassword) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  console.log({ errors, isValid });

  const onSubmit = async (data: any) => {
    setResetPass(false);
  };

  return (
    <form className={`content ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div className='form-fields'>
        <TextField
          label='Old password'
          type={showPassword ? 'text' : 'password'}
          required
          {...register('currentPassword')}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message?.toString()}
          endAdornment={
            <IconButton
              noBackground
              style={{ color: '#184d6d' }}
              onClick={() => setShowPassword((show) => !show)}>
              {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
            </IconButton>
          }
          placeholder='Enter your current password'
        />

        <TextField
          label='New password'
          required
          {...register('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message?.toString()}
          endAdornment={
            <IconButton
              noBackground
              style={{ color: '#184d6d' }}
              onClick={() => setShowNewPassword((show) => !show)}>
              {<Icon icon={showNewPassword ? 'eye' : 'eye-invisible'} />}
            </IconButton>
          }
          placeholder='Enter new password'
        />

        <TextField
          label='Confirm password'
          required
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
          endAdornment={
            <IconButton
              noBackground
              style={{ color: '#184d6d' }}
              onClick={() => setShowConfirmPassword((show) => !show)}>
              {<Icon icon={showConfirmPassword ? 'eye' : 'eye-invisible'} />}
            </IconButton>
          }
          placeholder='Confirm password'
        />
      </div>
      <Button className='reset-button' type='submit' disabled={!isValid} size='large'>
        Reset
      </Button>
    </form>
  );
})`
  &.content {
    margin-top: 24px;

    .form-fields {
      margin-top: 24px;
      display: grid;

      row-gap: 28px;
      column-gap: 16px;
      max-width: 672px;
    }

    .reset-button {
      margin-top: 36px;
      width: 100%;
    }
  }
`;
