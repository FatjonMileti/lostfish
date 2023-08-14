import React from 'react';
import { styled } from '@mui/system';
import { Header } from '../Home/Header';

export const Mission = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`home-page ${className}`}>
      <Header />
    </div>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    grid-template-rows: min-content auto;

    background: linear-gradient(148deg, #fffbf3 18.95%, #fff 100%);
    z-index: 0;

    .header {
      z-index: 1;
    }
  }
`;
