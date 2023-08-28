import { styled } from '@mui/system';
import React, { HTMLProps, MouseEventHandler } from 'react';

import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { Avatar } from '../../../components/Avatar';

import { avatars } from '../../HomeLoggedIn/avatars';
import { Slider } from './Slider';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

export interface PropertyProps extends HTMLProps<HTMLDivElement> {
  name: string;
  status: string;
  viewDetails: MouseEventHandler;
  images: any[];
  description: string;
  location: string;
  area: number;
  budget: {
    min_budget: number;
    max_budget: number;
  };
  roomsDetails: {
    number_of_bedrooms: number;
    number_of_bathrooms: number;
  };
  propertyType: string;
  parkingSpot: number;
  epcRating: string;
}

const propertyStatusMap: any = {
  Draft: 'draft',
  Live: 'published',
  Completed: 'rented'
};

export const Property = styled(
  ({
    className,
    name,
    status,
    viewDetails,
    images,
    description,
    location,
    area,
    budget,
    roomsDetails,
    propertyType,
    parkingSpot,
    epcRating
  }: PropertyProps) => {
    const navigate = useNavigate();
    return (
      <div className={classNames('property', className)}>
        <div className='details'>
          <div>
            <Label className={classNames('status', propertyStatusMap[status] || 'draft')}>{status}</Label>

            {name && (
              <Typography className='property-title' variant='body3'>
                {name}
              </Typography>
            )}

            <div className='property-details'>
              {location && (
                <div className='detail'>
                  <Icon icon='location' /> <Typography variant='body5'>{location}</Typography>
                </div>
              )}
              {budget && (
                <div className='detail'>
                  <Icon icon='banknote' />{' '}
                  <Typography variant='body5'>
                    £ {budget.min_budget} / {budget.max_budget} PCM
                  </Typography>
                </div>
              )}
              {area && (
                <div className='detail'>
                  <Icon icon='ruler' /> <Typography variant='body5'>{area} sqm </Typography>
                </div>
              )}
              {roomsDetails?.number_of_bedrooms && (
                <div className='detail'>
                  <Icon icon='double-bed' />
                  <Typography variant='body5'>{roomsDetails.number_of_bedrooms}</Typography>
                </div>
              )}
              {roomsDetails?.number_of_bathrooms && (
                <div className='detail'>
                  <Icon icon='bathtub' />{' '}
                  <Typography variant='body5'>{roomsDetails.number_of_bathrooms}</Typography>
                </div>
              )}
              {propertyType && (
                <div className='detail'>
                  <Icon icon='building' /> <Typography variant='body5'>{propertyType}</Typography>
                </div>
              )}
              {parkingSpot && (
                <div className='detail'>
                  <Icon icon='car' /> <Typography variant='body5'>{parkingSpot} Parking Spot</Typography>
                </div>
              )}
              {epcRating && (
                <div className='detail'>
                  <Icon icon='temperature' />{' '}
                  <Typography variant='body5'>EPC Rating: {epcRating}*</Typography>
                </div>
              )}
            </div>

            {description && (
              <Typography variant='body4' className='description'>
                {description}
              </Typography>
            )}
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
            <div className='action-buttons'>
              <Button size='large' onClick={() => navigate('/matches')}>
                View matches
              </Button>
              <Button size='large' variant='secondary' className='details-button' onClick={viewDetails}>
                Edit property
              </Button>
            </div>
          </div>
        </div>

        <Slider images={images} />
      </div>
    );
  }
)`
  &.property {
    border-radius: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    min-height: 292px;
    position: relative;

    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.15);

    background: #fff;

    .property-title {
      margin-top: 24px;
      font-weight: 700;
    }

    .details {
      padding: 24px;
      box-sizing: border-box;
      display: grid;
      align-content: space-between;
      row-gap: 8px;
      border-radius: 16px 0 0 16px;

      .status {
        &.label {
          padding: 12px 20px !important;

          &.draft {
            background: rgba(64, 129, 64, 0.1);
            color: #408140;
          }

          &.published {
            background: rgba(192, 218, 255, 0.2);
            color: #184d6d;
          }

          &.rented {
            background: rgba(64, 129, 64, 0.1);
            color: #408140;
          }
        }
      }

      .property-details {
        margin-top: 16px;
        display: flex;
        gap: 24px;
        flex-wrap: wrap;

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
              background-color: #f7f1e7;

              color: #0d2a38;
              font-weight: 700;
              display: flex;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              margin-left: -8px;
            }
          }
        }

        .action-buttons {
          display: flex;
          column-gap: 16px;
        }
      }
    }
  }
`;
