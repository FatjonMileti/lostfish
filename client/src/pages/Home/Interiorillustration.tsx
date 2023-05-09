import { styled } from '@mui/system';
import Illustration1 from '../../assets/images/illustration1.png';
import React from 'react';

export const Interiorillustration = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return <img className={`illustration1 ${className}`} src={Illustration1} alt='illustration' />;
})`
  &.illustration1 {
    width: 100%;
    height: auto;
  }
`;
