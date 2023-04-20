import styled from '@emotion/styled';
import React from 'react';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

import { Header } from './Header';
import { Footer } from './Footer';

import { Intersection } from './Intersection';
import { WhatDoWeDo } from './WhatDoWeDo';
import { WhatDefinedUs } from './WhatDefinedUs';
import { BuildingsIllustration } from './BuildingsIllustration';
import { DailyNews } from './DailyNews';
import { Interiorillustration } from './Interiorillustration';

import homePageBackgroundImage from './homePageBackground.png';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='background-image-section'>
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

        <Intersection />
      </div>

      <Interiorillustration />

      <WhatDoWeDo />

      <DailyNews />

      <BuildingsIllustration />

      <WhatDefinedUs />

      <div className='join-our-community-section'>
        <Button size='large' variant='contained' endIcon={<Icon icon='arrow-right' size={28} />}>
          Join our community
        </Button>
      </div>
      <Footer />
    </div>
  );
})`
  max-width: 1440px;
  margin-inline: auto;

  .background-image-section {
    background-image: url(${homePageBackgroundImage});
    background-repeat: no-repeat;
    background-size: cover;
    padding-bottom: 52px;

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

    .intersection {
    }
  }

  .join-our-community-section {
    margin-top: 48px;
    display: flex;
    justify-content: center;
    button {
      text-transform: none;
      display: flex;
      column-gap: 10px;
      align-items: center;
    }
  }
`;
