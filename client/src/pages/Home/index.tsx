import styled from '@emotion/styled';

import React from 'react';
import { Header } from './Header';
import { Typography } from './Typography';

import Illustration1 from '../../assets/images/illustration1.png';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <Header />
      <div className='title-and-decription'>
        <Typography variant='h1'>Welcome to Lostfish.</Typography>
        <Typography variant='body4' className='text2'>
          Our aim is to revolutionise the property industry by utilising technology and data to empower and
          inform customers in the buying, selling, and renting process.
        </Typography>
        <Typography variant='body2' className='text3'>
          What’s in it for you?
        </Typography>
      </div>
      <img className='illustration1' src={Illustration1} alt='illustration' />
    </div>
  );
})`
  .title-and-decription {
    margin-inline: auto;
    max-width: 904px;
    margin-top: 64px;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;

    .text2 {
      margin-top: 24px;
      max-width: 672px;
    }

    .text3 {
      margin-top: 64px;
    }
  }

  .illustration1 {
    width: 100%;
    height: auto;
    margin-top: 52px;
  }
`;
