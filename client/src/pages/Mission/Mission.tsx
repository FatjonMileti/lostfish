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
    background-color: #f7f1e7;

    grid-template-rows: min-content auto;

    .header {
      z-index: 1;
    }
  }
`;
