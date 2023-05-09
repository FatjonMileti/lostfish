import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import React from 'react';

export const WhatDefinedUs = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`what-defines-us-section ${className}`}>
      <Typography variant='menu' className='section-title'>
        WHAT defines us?
      </Typography>
      <div className='cards-wrapper'>
        <Card className='no-waiting'>
          <Typography variant='body3'>No waiting, no chasing,  no middlemen.</Typography>
          <Typography variant='body4'>
            Our goal is to increase transparency and trust in the process to achieve the best results for
            customers in a quick, calm, and informed manner.
          </Typography>
        </Card>
        <Card className='find-your-dream'>
          <Typography variant='body3'>Find your dream home, with AI-powered precision.</Typography>
          <Typography variant='body4'>
            We aim to revolutionise the property industry by utilising technology and data to empower and
            inform customers in the buying, selling, and renting process.
          </Typography>
        </Card>
        <Card className='hassle-free'>
          <Typography variant='body3'>Hassle-free housing.</Typography>
          <Typography variant='body4'>
            We want to create a stress-free environment where you have access to unbiased and real-time
            information, as well as support and guidance at every stage of the process.
          </Typography>
        </Card>
      </div>
    </div>
  );
})`
  &.what-defines-us-section {
    margin-top: 88px;
    padding-inline: 36px;

    .section-title {
      text-align: center;
    }

    .cards-wrapper {
      margin-top: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 24px;

      .card {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        justify-content: space-between;
        padding: 48px;
      }

      .no-waiting {
        background-color: #e7e7e7;
      }

      .find-your-dream {
        background-color: #c0daff;
      }

      .hassle-free {
        background-color: #eee0d3;
      }
    }
  }
`;
