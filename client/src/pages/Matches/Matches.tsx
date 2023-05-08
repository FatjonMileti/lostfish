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
    background: linear-gradient(90deg, #e8edf0 0%, #fce8ef 100%);
    height: 100vh;
  }
`;
