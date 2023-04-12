import LogoLostFishColored from '../../assets/svg/LogoLostFishColored.svg';
import { Link } from './Link';
import { Button } from './Button';
import { Logo } from './Logo';
import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`header ${className}`}>
      <div className='left'>
        <Logo />

        <div className='menu'>
          <Link>Rent</Link>
          <Link>Buy</Link>
          <Link>Sell</Link>
          <Link>Lease</Link>
        </div>
      </div>

      <div className='right'>
        <Link>Login</Link>
        <Button variant='outlined' onClick={() => navigate('/components')}>
          Sign Up
        </Button>
      </div>
    </div>
  );
})`
  &.header {
    height: 112px;
    //border: 1px solid black;
    align-items: center;

    padding: 24px 36px;

    display: grid;
    grid-template-columns: min-content auto;
    justify-content: space-between;

    .left {
      display: flex;
      column-gap: 24px;

      .menu {
        list-style: none;
        display: flex;
        align-items: center;
        column-gap: 40px;
        margin: 0;
        padding: 0;
      }
    }

    .right {
      display: flex;
      align-items: center;
      column-gap: 40px;
    }
  }
`;
