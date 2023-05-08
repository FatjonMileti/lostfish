import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import { HTMLAttributes } from 'react';

export const Matches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`matches-page ${className}`}>
      <Header />
    </div>
  );
})`
  &.matches-page {
    background: linear-gradient(141.18deg, #cdf0ea 10.08%, #f9f9f9 98.58%);
    height: 100vh;
  }
`;
