import { styled } from '@mui/system';
import { Modal, ModalProps } from '../../components/Modal';
import classNames from 'classnames';
import { Typography } from '../../components/Typography';
import { CloseButton } from '../../components/CloseButton';
import React from 'react';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import config from '../../config';
import { Label } from '../../components/Label';
import { ShowGlobalLoading } from '../../components/ShowGlobalLoading';
import { RecoverPasswordVerifyEmailModal } from './RecoverPasswordVerifyEmailModal';

const schema = yup.object().shape({
  email: yup.string().email().required('email is required')
});

interface ForgotPasswordModalProps extends ModalProps {
  onSigInClick?: () => void;
}

export const ForgotPasswordModal = styled(
  ({
    className,
    onSigInClick = () => {},
    onBackdropClick = () => {},
    ...otherProps
  }: ForgotPasswordModalProps) => {
    const [showEmailSentModal, setShowEmailSentModal] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState(false);

    const form = useForm({ resolver: yupResolver(schema), mode: 'all' });

    const onSubmit = async (data: any) => {
      setLoading(true);
      const { email } = data;

      try {
        await axios.post(`${config.apiUrl}/api/user/forgot-password`, {
          email
        });

        onBackdropClick();
        setShowEmailSentModal(true);
      } catch (err: AxiosError | any) {
        const message = err?.response?.data?.message;

        if (!message) throw err;

        if (message === 'user_not_found') {
          return form.setError('email', { message: 'User not found!', type: 'server' });
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {loading && <ShowGlobalLoading />}
        <RecoverPasswordVerifyEmailModal
          open={showEmailSentModal}
          onSigInClick={() => {
            setShowEmailSentModal(false);
            onSigInClick();
          }}
          sendAnotherEmail={form.handleSubmit(onSubmit)}
          onBackdropClick={() => setShowEmailSentModal(false)}
        />
        <Modal className={classNames('forgot-password-modal', className)} {...otherProps}>
          <div className='modal-header'>
            <Typography variant='body3' className='title'>
              Reset your password
            </Typography>
            <CloseButton inverted={false} background={true} size='medium' onClick={onBackdropClick} />
          </div>

          <div className='container'>
            <Typography variant='body4' className='description'>
              Enter below the email address that you signed up with and follow the instructions sent to your
              email address to successfully reset your password.
            </Typography>

            <form className='form-fields'>
              <TextField
                label='Email'
                className='email-input'
                required
                {...form.register('email')}
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email?.message?.toString()}
                placeholder='Enter your email'
              />
            </form>

            <Button
              className='send-instructions-button'
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isValid}
              size='large'>
              Reset password
            </Button>

            <div className='line' />

            <Label className='sign-in' variant='tertiary' onClick={onSigInClick}>
              Click here to sign in
            </Label>
          </div>
        </Modal>
      </>
    );
  }
)`
  &.forgot-password-modal {
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

      .send-instructions-button {
        width: 100%;
      }

      .line {
        width: 100%;
        height: 2px;
        background-color: #e7e7e7;
      }

      .sign-in {
        justify-self: center;
      }
    }
  }
`;
