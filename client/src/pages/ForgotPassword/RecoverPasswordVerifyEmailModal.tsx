import { styled } from '@mui/system';
import { Modal, ModalProps } from '../../components/Modal';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import React from 'react';
import { CloseButton } from '../../components/CloseButton';
import classNames from 'classnames';
import { Backdrop } from '../../components/Backdrop';

import fastMessage from '../CreateAccount/fastMessage.svg';
import { Label } from '../../components/Label';

interface RecoverPasswordVerifyEmailModalProps extends ModalProps {
  onSigInClick: () => void;
  sendAnotherEmail: () => void;
}

export const RecoverPasswordVerifyEmailModal = styled(
  ({ className, onSigInClick, ...otherProps }: RecoverPasswordVerifyEmailModalProps) => {
    const [loading, setLoading] = React.useState(false);
    const sendAnotherEmail = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(() => resolve(true), 1000));
      setLoading(false);
    };

    return (
      <>
        <Backdrop open={loading}></Backdrop>
        <Modal className={classNames('verify-email-modal', className)} {...otherProps}>
          <div className='modal-header'>
            <Typography variant='body3' className='title'></Typography>
            <CloseButton
              inverted={false}
              background={true}
              size='large'
              onClick={otherProps.onBackdropClick}
            />
          </div>
          <div className='content'>
            <img className='email-sent-illustration' src={fastMessage} alt='email sent' />
            <Typography variant='body2' className='confirmation-sent-title'>
              Verify your email
            </Typography>

            <Typography variant='body4' className='description'>
              We’ve sent you an email to verify that your account has a valid email address. Follow the
              instructions sent to you to recover your account.
            </Typography>

            <div className='did-not-received-email'>
              <Typography variant='body4'>Didn’t receive it?</Typography>
              <Label className='send-another-email-button' variant='tertiary' onClick={sendAnotherEmail}>
                Send another email
              </Label>
            </div>

            {/*<Button size='large' className='sign-in-button' onClick={onSigInClick}>*/}
            {/*  Sign In*/}
            {/*</Button>*/}
          </div>
        </Modal>
      </>
    );
  }
)`
  &.verify-email-modal {
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100%;
    width: 440px;
    display: grid;

    .modal-container {
      display: grid;
      row-gap: 24px;
      padding-bottom: 32px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-family: At Gambit, serif;
      }
    }

    .content {
      display: grid;
      justify-items: center;
      row-gap: 24px;

      .email-sent-illustration {
        width: 64px;
        height: 64px;
      }

      .description {
        text-align: center;
      }

      .did-not-received-email {
        display: flex;
        column-gap: 8px;
        align-items: center;
      }

      .sign-in-button {
        width: 100%;
      }
    }
  }
`;
