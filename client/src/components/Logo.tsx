import React from 'react';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

import LogoLostFishColored from '../assets/svg/LogoLostFishColored.svg';

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Logo = styled(({ className }: LogoProps) => {
  return (
    <NavLink to='/'>
      <img alt='Logo' className={`logo ${className}`} src={LogoLostFishColored} />
    </NavLink>
  );
})`
  &.logo {
    height: 64px;
    width: auto;
    ${(props) => props.theme.breakpoints.down('laptop')} {
      height: 48px;
    }
  }
`;
