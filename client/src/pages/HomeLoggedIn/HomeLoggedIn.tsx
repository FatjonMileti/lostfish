import React from 'react';
import { styled } from '@mui/system';
import { Header } from './Header';
import { Backdrop } from '../../components/Backdrop';
import { Footer } from '../Home/Footer';
import { SectionOne } from './HomeLoggedIn.SectionOne';
import { SectionTwo } from './HomeLoggedIn.SectionTwo';
import { SectionThree } from './HomeLoggedIn.SectionThree';
import { SectionFour } from './HomeLoggedIn.SectionFour';
import { SectionFive } from './HomeLoggedIn.SectionFive';

import backgroundImg from '../About/sectionOne.About.png';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      <div className='container'>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
        <SectionFive />
      </div>

      <Footer />
    </div>
  );
})`
  &.home-logged-in-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto min-content;

    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: url(${backgroundImg}), lightgray 50% / cover no-repeat;
      opacity: 0.05;

      background-size: auto;
      background-position-x: center;
      background-position-y: center;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;

      background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
      background-position-y: top;
      background-size: cover;
      z-index: -2;
    }

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
