import React from 'react';
import { styled } from '@mui/system';

import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../globalState';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();

  const {
    user: [user, setUser]
  } = useGlobalState();

  const logOut = () => {
    setUser((user: any) => ({ ...user, auth: null }));
  };

  return (
    <div className={`header ${className}`}>
      <div className='left-part'>
        <Logo />
      </div>

      <div className='middle-part'>
        <div className='menu'>
          <Link>DAILY SUMMARY</Link>
          <Link>MATCHES</Link>
          <Link>PROPERTIES</Link>
          <Link>MESSAGES</Link>
        </div>
      </div>

      <div className='right-part'>
        {/*<Link onClick={() => navigate('/login')}>Login</Link>*/}

        <Button variant='outlined' onClick={logOut}>
          Log out
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
    grid-template-columns: auto auto auto;
    justify-content: space-between;

    .left-part {
      display: flex;
      column-gap: 24px;
    }

    .middle-part {
      .menu {
        list-style: none;
        display: flex;
        align-items: center;
        column-gap: 40px;
        margin: 0;
        padding: 0;
      }
    }

    .right-part {
      display: flex;
      align-items: center;
      column-gap: 40px;
    }
  }
`;
