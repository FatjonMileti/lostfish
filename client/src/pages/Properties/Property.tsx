import { styled } from '@mui/system';
import React, { HTMLProps, MouseEventHandler } from 'react';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/Avatar';

import { avatars } from '../HomeLoggedIn/avatars';

import property from '../MyAccount/images/property.png';

export interface PropertyProps extends HTMLProps<HTMLDivElement> {
  name: string;
  status: string;
  viewDetails: MouseEventHandler;
  image?: string;
}

export const Property = styled(
  ({ className, name = 'Two bedroom apartment for rent', status, viewDetails, image }: PropertyProps) => {
    return (
      <div className={`property ${className}`}>
        <div>
          <img className='property-background-image' alt='property-image' src={image || property} />
        </div>

        <div className='details'>
          <div>
            <Label active className='status'>
              {status}
            </Label>

            <div className='property-details'>
              <div className='detail'>
                <Icon icon='location' /> <Typography variant='body5'>Bristol</Typography>
              </div>
              <div className='detail'>
                <Icon icon='banknote' /> <Typography variant='body5'>£1,150 PCM</Typography>
              </div>
              <div className='detail'>
                <Icon icon='ruler' /> <Typography variant='body5'>796 sqft/74 sqm </Typography>
              </div>
              <div className='detail'>
                <Icon icon='double-bed' /> <Typography variant='body5'>2</Typography>
              </div>
              <div className='detail'>
                <Icon icon='bathtub' /> <Typography variant='body5'>1</Typography>
              </div>
            </div>

            <Typography className='property-title' variant='body3'>
              {name}
            </Typography>

            <Typography variant='body4' className='description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla...
            </Typography>
          </div>

          <div className='line' />

          <div className='actions-and-potential-matches'>
            <div className='potential-matches'>
              <Typography className='title' variant='body5'>
                Potential matches
              </Typography>
              <div className='potential-matches-list'>
                <Avatar image={avatars[0].image} />
                <Avatar image={avatars[1].image} />
                <Avatar image={avatars[2].image} />
                <div className='others-number'>
                  <Typography variant='body4'>+49</Typography>
                </div>
              </div>
            </div>
            <Button size='small' variant='secondary' className='details-button' onClick={viewDetails}>
              Edit property
            </Button>
          </div>
        </div>
      </div>
    );
  }
)`
  &.property {
    border-radius: 16px;
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    column-gap: 24px;
    min-height: 292px;
    position: relative;

    background: var(--monochrome-pure-white, #fff);

    .property-background-image {
      //position: absolute;
      border-radius: 16px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      width: 100%;
      height: auto;
      aspect-ratio: 1.6 / 1;
    }

    .property-title {
      margin-top: 24px;
      font-weight: 700;
      //text-overflow: ellipsis;
    }

    .details {
      padding: 24px;
      box-sizing: border-box;
      display: grid;
      align-content: space-between;
      row-gap: 8px;

      .status {
        padding: 12px 20px;
      }

      .property-details {
        margin-top: 18px;
        display: flex;
        column-gap: 24px;

        .detail {
          display: flex;
          column-gap: 4px;
          align-items: center;
          color: #646464;
          .typography {
            font-weight: 700;
          }
        }
      }

      .description {
        margin-top: 24px;
      }

      .line {
        background: var(--neutral-light-grey, #f3f4f5);
        height: 1px;
        align-self: stretch;
      }

      .actions-and-potential-matches {
        display: flex;
        justify-content: space-between;
        column-gap: 24px;
        align-items: flex-end;

        .potential-matches {
          display: grid;
          row-gap: 16px;
          .title {
            color: #646464;
            line-height: 16px;
            font-weight: 500;
          }

          .potential-matches-list {
            display: flex;
            .avatar {
              height: 64px;
              width: 64px;
              margin-left: -8px;
              z-index: 1;
              &:first-of-type {
                margin-left: 0;
              }
            }

            .others-number {
              height: 64px;
              width: 64px;
              border-radius: 50%;
              background-color: #184d6d;
              color: white;
              font-weight: 700;
              display: flex;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              margin-left: -8px;
            }
          }
        }
      }
    }
  }
`;
