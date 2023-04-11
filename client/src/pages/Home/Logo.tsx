import LogoLostFishColored from '../../assets/svg/LogoLostFishColored.svg';
import React from 'react';
import styled from '@emotion/styled';

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Logo = styled(({ className }: LogoProps) => {
  return <img alt='Logo' className={`logo ${className}`} src={LogoLostFishColored} />;
})`
  &.logo {
    height: 64px;
    width: auto;
  }
`;
