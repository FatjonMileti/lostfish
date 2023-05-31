import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';

export const AccountSettings = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`account-settings ${className}`}>
      <div className='left-part'>
        <div className='section'>
          <Typography className='section-title' variant='body4'>
            Password reset
          </Typography>
          <div className='password-reset'>
            <Typography variant='body5'>
              An email with password reset instructions will be sent to your email. After reseting your
              password you will have to login again.
            </Typography>

            <Button variant='secondary'>Reset password</Button>
          </div>
        </div>

        <div className='section'>
          <Typography className='section-title' variant='body4'>
            Close account
          </Typography>
          <div className='close-account'>
            <Typography variant='body5'>
              If you want to delete your account you can do so by clicking the button below. Be aware that any
              matches or ongoing messages will be deleted and can not be recovered.
            </Typography>
            <Link>Close my Lostfish account</Link>
          </div>
        </div>
      </div>
      <div className='right-part'></div>
    </div>
  );
})`
  &.account-settings {
    display: grid;
    grid-template-columns: 50% 50%;
    min-height: 100%;

    .left-part {
      display: grid;
      row-gap: 32px;
      align-content: flex-start;
    }

    .right-part {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }

    .section {
      display: grid;
      row-gap: 16px;
      .section-title {
        color: #646464;
      }
    }

    .password-reset {
      display: grid;
      row-gap: 16px;
    }

    .close-account {
      display: grid;
      row-gap: 16px;
    }
  }
`;
