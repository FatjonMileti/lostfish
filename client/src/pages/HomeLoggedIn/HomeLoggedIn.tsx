import React from 'react';
import { styled } from '@mui/system';
import { Footer } from '../Home/Footer';
import { Header } from './Header';

import { Intersection } from '../Home/Intersection';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />
      <Intersection />
      <Footer />
    </div>
  );
})`
  &.home-logged-in-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto min-content;
  }
`;
