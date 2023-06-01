import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Switch } from '../../components/Switch';

export const NotificationSettings = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`notification-settings ${className}`}>
      <Typography variant='body4'>Matches notifications</Typography>
      <div className='notification-list'>
        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Email me when I get a match
            </Typography>
            <Typography variant='body4'>You will receive an email whenever you got a new match.</Typography>
          </div>
          <Switch size='small' defaultChecked={true} />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Text me when I get a match
            </Typography>
            <Typography variant='body4'>You will receive an SMS whenever you got a new match.</Typography>
          </div>
          <Switch size='small' />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Email me when someone accepts my match
            </Typography>
            <Typography variant='body4'>
              You will receive an email when someone accepts your match.
            </Typography>
          </div>
          <Switch size='small' defaultChecked={true} />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Text me when someone accepts my match
            </Typography>
            <Typography variant='body4'>You will receive an SMS when someone accepts your match.</Typography>
          </div>
          <Switch size='small' />
        </div>
      </div>
    </div>
  );
})`
  &.notification-settings {
    display: grid;
    row-gap: 16px;
    .notification-list {
      display: grid;
      row-gap: 8px;
      .notification {
        display: grid;
        grid-template-columns: auto min-content;
        align-items: center;
        column-gap: 24px;

        background-color: #f3f4f5;
        border-radius: 8px;
        padding: 16px;
        max-width: 556px;

        .texts {
          display: grid;
          row-gap: 8px;
          .title {
            font-weight: 600;
          }
        }
      }
    }
  }
`;
