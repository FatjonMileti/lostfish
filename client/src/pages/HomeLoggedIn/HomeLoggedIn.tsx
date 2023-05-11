import React from 'react';
import { styled } from '@mui/system';
import { Footer } from '../Home/Footer';
import { Header } from './Header';

import { Intersection } from '../Home/Intersection';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <Header />
      <Intersection />
      <Footer />
    </div>
  );
})`
  margin-inline: auto;
`;
