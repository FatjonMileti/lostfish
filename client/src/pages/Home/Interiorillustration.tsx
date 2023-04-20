import styled from '@emotion/styled';
import Illustration1 from '../../assets/images/illustration1.png';
import React from 'react';

export const Interiorillustration = styled(({ className = '' }) => {
  return <img className={`illustration1 ${className}`} src={Illustration1} alt='illustration' />;
})`
  &.illustration1 {
    width: 100%;
    height: auto;
  }
`;
