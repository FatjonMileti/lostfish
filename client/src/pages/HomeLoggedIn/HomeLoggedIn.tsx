import React from 'react';
import { styled } from '@mui/system';

import { Header } from './Header';
import { Backdrop } from '../../components/Backdrop';
import { Footer } from '../Home/Footer';
import { SectionThree } from './HomeLoggedIn.SectionThree';
import { SectionFive } from './HomeLoggedIn.SectionFive';
import { SectionTwo as HomeLoggedOutSectionTwo } from '../About/About.SectionTwo';

import { Suggestions } from '../Suggestions/Suggestions';
import { FaqSection } from '../About/About.FaqSection';

import forestBackgroundImage from '../About/forest.jpeg';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      <div className='container'>
        <Suggestions />
        <HomeLoggedOutSectionTwo />
        <SectionFive />
        <SectionThree />
        <FaqSection />
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
      background: url(${forestBackgroundImage});
      background-repeat: no-repeat;
      opacity: 0.05;

      background-size: cover;
      //background-position-x: center;
      //background-position-y: center;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;

      //background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
      //background-position-y: top;
      background: linear-gradient(180deg, rgba(255, 251, 243, 0.99) 18.95%, rgba(255, 255, 255, 0.95) 100%),
        rgba(255, 255, 255, 0.2);
      background-size: cover;
      z-index: -2;
    }

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
