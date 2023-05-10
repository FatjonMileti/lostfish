import React from 'react';
import { styled } from '@mui/system';

import { Typography } from '../../components/Typography';
import { Header } from './Header';

import binocularsDesktop from './binocularsDesktop.png';
import binocularsLaptop from './binocularsLaptop.png';
import binocularsTablet from './binocularsTablet.png';
import binocularsMobile from './binocularsMobile.png';

import { Carousel } from './Carousel';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`home-page ${className}`}>
      <Header />

      <div className='slider-section'>
        <Carousel>
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
      </div>
    </div>
  );
})`
  &.home-page {
    min-height: 100vh;
    display: grid;

    grid-template-rows: min-content auto;

    background-image: linear-gradient(180deg, rgba(247, 241, 231, 0) 75.26%, #f7f1e7 100%),
      url(${binocularsDesktop});

    background-color: #f7f1e7;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;

    /* Laptops (1024px to 1439px) */
    ${(props) => props.theme.breakpoints.only('laptop')} {
      background-image: linear-gradient(180deg, rgba(247, 241, 231, 0) 75.26%, #f7f1e7 100%),
        url(${binocularsLaptop});
    }

    /* Tablets (768px to 1023px) */
    ${(props) => props.theme.breakpoints.only('tablet')} {
      background-image: linear-gradient(180deg, rgba(247, 241, 231, 0) 75.26%, #f7f1e7 100%),
        url(${binocularsTablet});
    }

    /* Mobile (375px to 767px) */
    ${(props) => props.theme.breakpoints.down('tablet')} {
      background-image: linear-gradient(180deg, rgba(247, 241, 231, 0) 75.26%, #f7f1e7 100%),
        url(${binocularsMobile});
    }

    .slider-section {
      background: white;
      align-self: flex-end;

      padding: 53px 36px;

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
