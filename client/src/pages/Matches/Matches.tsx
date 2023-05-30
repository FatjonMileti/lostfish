import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import React, { HTMLAttributes } from 'react';
import { Footer } from '../Home/Footer';
import { ImageGallery } from './ImageGalery';

export const Matches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`matches-page ${className}`}>
      <Header />
      <div className='page-body'>
        <ImageGallery />
      </div>
      <Footer />
    </div>
  );
})`
  &.matches-page {
    background: linear-gradient(90deg, #e8edf0 0%, #fce8ef 100%);
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto min-content;

    .page-body {
      padding: 36px;
    }
  }
`;
