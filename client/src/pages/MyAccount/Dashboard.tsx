import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { Avatar } from '../../components/Avatar';

import cloud from './images/cloud.png';
import property from './images/property.png';
import verified from './images/verified.svg';

import { avatars } from '../HomeLoggedIn/avatars';

export const Dashboard = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`dashboard ${className}`}>
      <div className='transaction-agreement'>
        <div className='left-part'>
          <Typography className='title' variant='body4'>
            Sign the transaction agreement
          </Typography>

          <Typography variant='body5' className='description'>
            The transaction agreement serves as a guarantee for both you, your match and Lostfish that
            everything will be covered following the ongoing UK laws.
          </Typography>

          <Button size='small' variant='secondary' className='sign-button'>
            Sign agreement
          </Button>
        </div>
      </div>

      <div className='starred-properties'>
        <Typography className='title' variant='body4'>
          Recently starred properties
        </Typography>

        <div className='starred-property'>
          <div className='property-footer'>
            <Typography className='property-title' variant='body4'>
              Two bed flat with terrace
            </Typography>
            <div className='details'>
              <div className='match-percentage'>
                <Typography variant='body5'>100%</Typography>
              </div>
              <Button size='small' variant='secondary' inverted className='details-button'>
                Property details
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='starred-tenants'>
        <Typography className='title' variant='body4'>
          Recently starred tenants
        </Typography>

        <div className='tenants'>
          <div className='tenant'>
            <Avatar image={avatars[0].image} className='profile-image' />
            <Typography className='tenant-name' variant='body4'>
              Nancy Jones
              <img src={verified} alt='verified' />
            </Typography>
            <Link>View profile</Link>
          </div>

          <div className='tenant'>
            <Avatar image={avatars[1].image} className='profile-image' />
            <Typography className='tenant-name' variant='body4'>
              Nick Young
              <img src={verified} alt='verified' />
            </Typography>
            <Link>View profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
})`
  &.dashboard {
    display: grid;
    grid-template-areas:
      'a a'
      'b c';
    gap: 32px 24px;
    grid-template-columns: 1fr 1fr;

    .transaction-agreement {
      background-color: #c0daff;
      border-radius: 16px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      background-image: url('${cloud}');
      background-repeat: no-repeat;
      background-position-x: right;
      grid-area: a;

      .left-part {
        padding: 24px;
        .title {
          font-size: 18px;
          font-weight: 700;
        }

        .description {
          margin-top: 16px;
        }

        .sign-button {
          margin-top: 24px;
        }
      }
    }

    .starred-properties {
      display: grid;
      row-gap: 16px;
      grid-template-rows: min-content auto;
      grid-area: b;

      .title {
        font-size: 18px;
        font-weight: 700;
      }

      .starred-property {
        background-image: url('${property}');
        border-radius: 16px;
        display: flex;
        aspect-ratio: 1.35 / 1;
        height: 326px;

        .property-footer {
          background: rgba(38, 38, 38, 0.7);
          backdrop-filter: blur(10px);
          align-self: flex-end;
          width: 100%;
          border-radius: 0 0 16px 16px;
          padding: 16px;
          box-sizing: border-box;
          row-gap: 8px;
          display: flex;
          flex-direction: column;
          .property-title {
            color: white;
            font-weight: 700;
          }

          .details {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .match-percentage {
              background-color: #e5155a;
              border-radius: 8px;
              color: white;
              padding: 4px 8px;
              box-sizing: border-box;
              font-weight: 700;
            }
          }
        }
      }
    }

    .starred-tenants {
      display: grid;
      row-gap: 16px;
      grid-template-rows: min-content auto;

      grid-area: c;
      .title {
        font-size: 18px;
        font-weight: 700;
      }

      .tenants {
        display: grid;
        grid-template-columns: min-content min-content;
        column-gap: 24px;
        .tenant {
          display: grid;
          justify-items: center;
          row-gap: 8px;
          align-content: flex-start;

          .profile-image {
            height: 208px;
            width: 208px;
          }

          .tenant-name {
            font-weight: 700;
            display: grid;
            grid-template-columns: max-content min-content;
            align-items: center;
            column-gap: 8px;
          }
        }
      }
    }
  }
`;
