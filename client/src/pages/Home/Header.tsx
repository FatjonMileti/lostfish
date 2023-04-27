import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import React from 'react';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`header ${className}`}>
      <div className='left'>
        <Logo />

        <div className='menu-desktop'>
          <Link>MISSION</Link>
          <Link>ABOUT</Link>
        </div>
      </div>

      <div className='right'>
        <Button size='medium' variant='outlined' onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button size='medium' variant='contained' onClick={() => navigate('/components')}>
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
    grid-template-columns: min-content auto;
    justify-content: space-between;

    ${(props) => props.theme.breakpoints.down('laptop')} {
      height: 80px;
      padding: 16px 36px;
    }

    .left {
      display: flex;
      column-gap: 24px;

      .menu-desktop {
        list-style: none;
        display: flex;
        align-items: center;
        column-gap: 40px;
        margin: 0;
        padding: 0;

        ${(props) => props.theme.breakpoints.down('laptop')} {
          display: none;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      column-gap: 16px;

      ${(props) => props.theme.breakpoints.down('laptop')} {
        display: none;
      }
    }
  }
`;
