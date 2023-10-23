import React from 'react';
import { styled } from '@mui/system';
import { Header } from '../Home/Header';
import { SectionOne } from './About.SectionOne';
import { SectionThree } from '../HomeLoggedIn/HomeLoggedIn.SectionThree';
import { SectionFive } from '../HomeLoggedIn/HomeLoggedIn.SectionFive';
import { SectionFour } from './About.SectionFour';
import { Footer } from '../Home/Footer';
import backgroundImg from './forest.jpeg';
import { SectionTwo } from './About.SectionTwo';

export const About = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`about-page ${className}`}>
      <Header />
      <SectionOne />
      <SectionTwo />
      <SectionFive />
      <SectionThree />
      <SectionFour />
      <Footer />
    </div>
  );
})`
  &.about-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    grid-template-rows: min-content auto;
    background: linear-gradient(148deg, #fffbf3 18.95%, #fff 100%);
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-image: url(${backgroundImg});
      background-repeat: no-repeat;
      opacity: 0.05;
      background-position-y: top;
      background-size: cover;
      z-index: -1;
    }

    .header {
      z-index: 1;
    }
  }
`;
