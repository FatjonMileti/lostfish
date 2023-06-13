import React from 'react';
import { styled } from '@mui/system';

import { Typography } from '../../components/Typography';
import { Header } from './Header';

import lookingFor from './lookingFor.png';
import cantFindTenants from './cantFindTenants.png';
import tiredOf from './tiredOf.png';

import { Carousel } from './Carousel';
import { AnimatePresence, motion } from 'framer-motion';
import { CookieConsent } from '../../components/CookieConsent';
import { useCookies } from 'react-cookie';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const indexStore = React.useState(0);
  const indexSlide = indexStore[0];

  return (
    <div className={`home-page ${className} slide${indexSlide}`}>
      {[lookingFor, cantFindTenants, tiredOf].map((img, i: number) => (
        <AnimatePresence key={i}>
          {indexSlide === i && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className='background-image'
              src={img}></motion.img>
          )}
        </AnimatePresence>
      ))}
      <Header />

      <div className='slider-section'>
        <Carousel indexStore={indexStore}>
          <div className='slide'>
            <Typography variant='h2' className='title'>
              Looking for your next home?
            </Typography>
            <Typography variant='body4' className='description'>
              Our goal is to revolutionise the property industry by utilising technology and data to empower
              and inform customers in the buying, selling, and renting process.
            </Typography>
          </div>
          <div className='slide'>
            <Typography variant='h2' className='title'>
              Can’t find perfect tenants?
            </Typography>
            <Typography variant='body4' className='description'>
              Our goal is to revolutionise the property industry by utilising technology and data to empower
              and inform customers in the buying, selling, and renting process.
            </Typography>
          </div>
          <div className='slide'>
            <Typography variant='h2' className='title'>
              Tired of irrelevant offers?
            </Typography>
            <Typography variant='body4' className='description'>
              Our goal is to revolutionise the property industry by utilising technology and data to empower
              and inform customers in the buying, selling, and renting process.
            </Typography>
          </div>
        </Carousel>
        <CookieConsent />
      </div>
    </div>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;

    grid-template-rows: min-content auto;

    .header {
      z-index: 1;
    }

    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;

      background-color: #f7f1e7;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top;
    }

    .slider-section {
      background: white;
      align-self: flex-end;

      padding: 53px 36px;
      z-index: 1;

      .slide {
        display: grid;
        grid-template-rows: 1fr;
        row-gap: 16px;
        width: 100%;
        justify-content: center;

        .title {
          max-width: 904px;
          text-align: center;
        }

        .description {
          max-width: 672px;
          text-align: center;
        }
      }
    }
  }
`;
