import styled from '@emotion/styled';
import illustration2 from '../../assets/images/illustration2.png';
import React from 'react';

export const BuildingsIllustration = styled(({ className = '' }) => {
  return (
    <div className={`illustration-2-section ${className}`}>
      <img alt='' src={illustration2} />
    </div>
  );
})`
  &.illustration-2-section {
    margin-top: 88px;
    padding-inline: 36px;
    display: flex;
    img {
      width: 100%;
    }
  }
`;
