import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import React from 'react';

export const DailyNews = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${className} daily-new-section`}>
      <div className='left-content'>
        <img src='images/dailyNews.png' alt='dayly news' />
      </div>
      <div className='right-content'>
        <div className='header'>
          <Typography variant='menu' className='daily-news-title'>
            DAILY NEWS
          </Typography>
          <div className='icons-wrapper'>
            <IconButton size='small' noBackground inverted>
              <Icon icon='share' size={18} color='white' />
            </IconButton>
            <IconButton size='small' noBackground inverted>
              <Icon icon='label-vertical' size={18} color='white' />
            </IconButton>
          </div>
        </div>
        <Typography variant='body1' className='body-text-1'>
          Experts predict a dip in property prices
        </Typography>
        <Typography variant='body4' className='body-text-2'>
          Experts are saying there’s going to be a decrease in London property prices in the upcoming months,
          and provide information on how you can benefit.
        </Typography>
        <div className='daily-news-footer'>
          <Typography variant='body4' className='progress-tracker'>
            1/3
          </Typography>
          <IconButton size='small' noBackground inverted>
            <Icon icon='arrow-right' size={36} color='white' />
          </IconButton>
        </div>
      </div>
    </div>
  );
})`
  &.daily-new-section {
    margin-top: 88px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .left-content {
      display: flex;
      img {
        width: 100%;
      }
    }

    .right-content {
      padding: 118px 140px;
      background-color: #184d6d;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .daily-news-title {
          color: #c0daff;
        }

        .icons-wrapper {
          display: flex;
          column-gap: 32px;
        }
      }

      .body-text-1 {
        margin-top: 88px;
        color: white;
      }

      .body-text-2 {
        margin-top: 16px;
        color: white;
      }

      .daily-news-footer {
        margin-top: 88px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .progress-tracker {
          color: white;
          font-size: 18px;
        }
      }
    }
  }
`;
