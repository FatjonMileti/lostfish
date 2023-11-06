import { styled } from '@mui/system';
import React, { HTMLProps, MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Avatar } from '../../../components/Avatar';

import { avatars } from '../../HomeLoggedIn/avatars';
import { Slider } from './Slider';

import { AreaUnitType } from '../NewProperty/property.types';

export interface PropertyProps extends HTMLProps<HTMLDivElement> {
  name: string;
  status: string;
  viewDetails: MouseEventHandler;
  images: any[];
  description: string;
  location: string;
  area: number;
  areaUnit: AreaUnitType;
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
  Draft: 'Draft',
  Live: 'Published',
  Completed: 'Rented'
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
    areaUnit,
    budget,
    roomsDetails,
    propertyType,
    parkingSpot,
    epcRating
  }: PropertyProps) => {
    return (
      <div className={classNames('property', className)}>
        <Slider images={images} />
        <div className='details'>
          <div className='description-header'>
            <Typography variant='body6' className='status'>
              {propertyStatusMap[status]}
            </Typography>
            <div className='potential-matches'>
              <Typography className='title' variant='body5'>
                Potential matches
              </Typography>
              <div className='potential-matches-list'>
                <Avatar image={avatars[0].image} />
                <Avatar image={avatars[1].image} />
                <Avatar image={avatars[2].image} />
                <div className='others-number'>
                  <Typography variant='body6'>+49</Typography>
                </div>
              </div>
            </div>
          </div>

          <div className='content'>
            <div className='title-property-details'>
              {name && (
                <Typography className='property-title' variant='body4'>
                  {name}
                </Typography>
              )}
              <div className='property-details'>
                {location && (
                  <>
                    <div className='detail'>
                      <Icon icon='location' /> <Typography variant='body5'>{location}</Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}

                {budget && (
                  <>
                    <div className='detail'>
                      <Icon icon='banknote' />{' '}
                      <Typography variant='body5'>
                        £ {budget.min_budget} / {budget.max_budget} PCM
                      </Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}

                {area && (
                  <>
                    <div className='detail'>
                      <Icon icon='ruler' />{' '}
                      <Typography variant='body5'>
                        {area} {areaUnit}{' '}
                      </Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}
                {roomsDetails?.number_of_bedrooms && (
                  <>
                    <div className='detail'>
                      <Icon icon='double-bed' />
                      <Typography variant='body5'>{roomsDetails.number_of_bedrooms}</Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}
                {roomsDetails?.number_of_bathrooms && (
                  <>
                    <div className='detail'>
                      <Icon icon='bathtub' />{' '}
                      <Typography variant='body5'>{roomsDetails.number_of_bathrooms}</Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}
                {propertyType && (
                  <>
                    <div className='detail'>
                      <Icon icon='building' /> <Typography variant='body5'>{propertyType}</Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}
                {parkingSpot && (
                  <>
                    <div className='detail'>
                      <Icon icon='car' /> <Typography variant='body5'>{parkingSpot} Parking Spot</Typography>
                    </div>
                    <Typography variant='body4' className='dot'>
                      •
                    </Typography>
                  </>
                )}
                {epcRating && (
                  <div className='detail'>
                    <Icon icon='temperature' />{' '}
                    <Typography variant='body5'>EPC Rating: {epcRating}*</Typography>
                  </div>
                )}
              </div>
            </div>

            {description && <Typography variant='body4'>{description}</Typography>}
          </div>

          <Button size='large' variant='secondary' onClick={viewDetails}>
            Edit property
          </Button>
        </div>
      </div>
    );
  }
)`
  &.property {
    display: grid;
    grid-template-columns: min-content auto;
    column-gap: 24px;
    position: relative;

    .slider {
      min-width: 440px;
    }

    .details {
      display: grid;
      grid-template-rows: min-content auto min-content;
      align-items: flex-start;
      row-gap: 24px;

      .description-header {
        display: flex;
        justify-content: space-between;
        align-content: center;

        .status {
          padding: 12px;
          background-color: #408140;
          border-radius: 20px;
          color: white;
          font-weight: 700;
        }
        .potential-matches {
          display: flex;
          align-items: center;
          gap: 16px;

          .title {
            color: #646464;
            line-height: 16px;
            font-weight: 500;
          }

          .potential-matches-list {
            display: flex;
            .avatar {
              height: 40px;
              width: 40px;
              margin-left: -8px;
              z-index: 1;
              &:first-of-type {
                margin-left: 0;
              }
            }

            .others-number {
              height: 40px;
              width: 40px;
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
      }

      .content {
        display: grid;
        row-gap: 16px;

        .title-property-details {
          display: grid;
          row-gap: 8px;

          .property-title {
            font-size: 20px;
            line-height: 28px;
            font-weight: 700;
          }

          .property-details {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .dot {
              color: #a7a7a7;
              font-weight: 700;
              opacity: 0.4;
            }

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
        }
      }
    }
  }
`;
