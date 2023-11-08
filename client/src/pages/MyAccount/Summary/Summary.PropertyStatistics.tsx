import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { usePropertyDetailsHook } from '../../HomeLoggedIn/hooks/usePropertyDetails.hook';

import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../components/Icon';

export const SummaryPropertyStatistics = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { property, propertyDetails } = usePropertyDetailsHook();

  return (
    <div className={classNames('summary-property-statistics', className)}>
      <div className='statistics-card'>
        <div className='card-label'>
          <Icon icon='eye-line' size={24} />
          <Typography variant='body6' className='title'>
            Property views
          </Typography>
        </div>
        <div className='content'>
          <Typography variant='body2' className='number'>
            {propertyDetails?.views}
          </Typography>
          <Typography variant='body5' className='progress'>
            +3.5% since last week
          </Typography>
        </div>
      </div>
      <div className='statistics-card'>
        <div className='card-label'>
          <Icon icon='intersect' size={24} />
          <Typography variant='body6' className='title'>
            Potential matches
          </Typography>
        </div>
        <div className='content'>
          <Typography variant='body2' className='number'>
            53
          </Typography>
          <Typography variant='body5' className='progress'>
            +12.8% since last week
          </Typography>
        </div>
      </div>
      <div className='statistics-card'>
        <div className='card-label'>
          <Icon icon='dashboard' size={24} />
          <Typography variant='body6' className='title'>
            Property score
          </Typography>
        </div>
        <div className='content'>
          <Typography variant='body2' className='number'>
            {!propertyDetails?.property_score ? 0 : propertyDetails.property_score}/100
          </Typography>
          <Typography variant='body5' className='points-available'>
            +5 points available
          </Typography>
        </div>
      </div>
      <div className='statistics-card'>
        <div className='card-label'>
          <Icon icon='pound-coin' size={24} />
          <Typography variant='body6' className='title'>
            Price
          </Typography>
        </div>
        <div className='content'>
          <div className='price'>
            {!!property?.asset_rent.rental_amount && (
              <Typography variant='body2' className='number'>
                £{property?.asset_rent.rental_amount}
              </Typography>
            )}

            <Typography variant='body6'>/month</Typography>
          </div>
          <Typography variant='body5' className='market-average'>
            Market average
          </Typography>
        </div>
      </div>
    </div>
  );
})`
  &.summary-property-statistics {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;
    align-content: flex-end;
    align-items: flex-end;

    grid-area: c;

    .statistics-card {
      display: grid;
      padding: 16px;
      border-radius: 12px;
      background: #f3f4f5;
      gap: 24px;
      min-height: 144px;
      box-sizing: border-box;

      .card-label {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #a7a7a7;

        .title {
          font-size: 14px;
          font-weight: 600;
        }
      }
      .content {
        display: grid;
        gap: 4px;
        font-weight: 700;
        align-content: flex-start;

        .number {
          font-family: Roobert, serif;
          font-weight: 700;
        }
        .progress {
          color: #408140;
        }
        .price {
          display: flex;
          align-items: flex-end;
          gap: 4px;
        }

        .points-available {
          color: #c4b1a3;
        }

        .market-average {
          color: #646464;
        }
      }
    }
  }
`;
