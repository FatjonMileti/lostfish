import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import React, { HTMLAttributes } from 'react';
import { Footer } from '../Home/Footer';
import { ImageGallery } from './ImageGalery';
import { SetCriteria } from '../SetCriteria/SetCriteria';

import { MatchesProperties } from './MatchesProperties/MatchesProperties';

export const Matches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const lookingFor = 'looking for a place';

  return (
    <div className={`matches-page ${className}`}>
      <Header />
      <div className='page-body'>
        {lookingFor === 'looking for a place' && <MatchesProperties />}
        <ImageGallery />
        <SetCriteria />
      </div>
      {/* <Footer /> */}
    </div>
  );
})`
  &.matches-page {
    //background: linear-gradient(90deg, #e8edf0 0%, #fce8ef 100%);
    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto;

    .page-body {
      padding: 24px 36px 36px 36px;
      display: grid;
    }
  }
`;
