import { Button } from '../../components/Button';
import React from 'react';
import { styled } from '@mui/system';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`header ${className}`}>
      <Icon icon='lost-fish-yin' size={64} />

      <div className='menu-desktop'>
        <NavLink to='/'>
          {({ isActive }) => (
            <Button active={isActive} inverted>
              Home
            </Button>
          )}
        </NavLink>
        <NavLink to='/about'>
          {({ isActive }) => (
            <Button active={isActive} inverted>
              About
            </Button>
          )}
        </NavLink>
        <NavLink to='/mission'>
          {({ isActive }) => (
            <Button active={isActive} inverted>
              Mission
            </Button>
          )}
        </NavLink>
      </div>

      <div className='right'>
        <Button className='join-button' size='medium' onClick={() => navigate('/login')}>
          Join
        </Button>
      </div>
    </div>
  );
})`
  &.header {
    height: 104px;
    align-items: center;

    padding: 20px 36px;
    box-sizing: border-box;

    display: grid;
    grid-template-columns: min-content max-content min-content;
    justify-content: space-between;

    ${(props) => props.theme.breakpoints.down('laptop')} {
      height: 80px;
      padding: 16px 36px;
    }

    .menu-desktop {
      list-style: none;
      display: flex;
      align-items: center;
      column-gap: 5px;
      margin: 0;

      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
      padding: 5px;
      border-radius: 30px;
      background: #ffffff;
    }

    .right {
      .join-button {
        padding-inline: 36px;
      }
    }
  }
`;
