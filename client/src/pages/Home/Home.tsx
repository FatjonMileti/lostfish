import { styled } from '@mui/system';
import { useTheme } from '@mui/material';
import React from 'react';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Header } from './Header';

import binocularsDesktop from './binocularsDesktop.png';
import binocularsLaptop from './binocularsLaptop.png';
import binocularsTablet from './binocularsTablet.png';
import binocularsMobile from './binocularsMobile.png';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const theme = useTheme();
  console.log(theme.breakpoints.up('tablet'));

  return (
    <div className={`home-page ${className}`}>
      <div className='container'>
        <Header />

        <div className='title-and-description'>
          <Typography variant='h1' className='title'>
            Looking for your next home?
          </Typography>
          <Typography variant='body4' className='text2'>
            Our goal is to revolutionise the property industry by utilising technology and data to empower and
            inform customers in the buying, selling, and renting process.
          </Typography>
          <Button className='how-it-works-button' variant='outlined'>
            HOW IT WORKS
          </Button>
        </div>
      </div>
    </div>
  );
})`
  &.home-page {
    min-height: 100vh;
    display: grid;

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
    ${(props) => props.theme.breakpoints.only('mobile')} {
      background-image: linear-gradient(180deg, rgba(247, 241, 231, 0) 75.26%, #f7f1e7 100%),
        url(${binocularsMobile});
    }

    .container {
      margin-inline: auto;
      height: 100%;
      width: 100%;

      display: grid;
    }

    .title-and-description {
      margin-inline: auto;

      max-width: 904px;
      margin-top: 64px;
      text-align: center;

      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: flex-end;

      ${(props) => props.theme.breakpoints.only('tablet')} {
        padding-inline: 36px;
      }

      ${(props) => props.theme.breakpoints.only('mobile')} {
        padding-inline: 20px;
      }

      .title {
        ${(props) => props.theme.breakpoints.only('mobile')} {
          font-size: 40px;
          line-height: 48px;
        }
      }

      .text2 {
        margin-top: 16px;
        max-width: 672px;
      }

      .how-it-works-button {
        margin-top: 48px;
      }

      padding-bottom: 32px;
    }
  }
`;
