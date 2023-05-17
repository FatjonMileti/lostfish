import React from 'react';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../globalState';
import request from '../../utils/axios';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();

  const {
    user: [user, setUser]
  } = useGlobalState();

  const logOut = async () => {
    await request(user.auth.access_token).post('/api/account/logout', {
      refresh_token: user.auth.refresh_token
    });
    setUser((user: any) => ({ ...user, auth: null, userDetails: null }));
    navigate('/');
  };

  return (
    <div className={`header ${className}`}>
      <div className='left-part'>
        <Logo />
      </div>

      <div className='middle-part'>
        <div className='menu'>
          <NavLink to='/'>
            {({ isActive }) => (
              <Button active={isActive} inverted>
                Home
              </Button>
            )}
          </NavLink>
          <NavLink to='/matches'>
            {({ isActive }) => (
              <Button active={isActive} inverted>
                Matches
              </Button>
            )}
          </NavLink>
          <NavLink to='/properties'>
            {({ isActive }) => (
              <Button active={isActive} inverted>
                Properties
              </Button>
            )}
          </NavLink>
          <NavLink to='/messages-page'>
            {({ isActive }) => (
              <Button active={isActive} inverted>
                Messages
              </Button>
            )}
          </NavLink>
        </div>
      </div>

      <div className='right-part'>
        {/*<Link onClick={() => navigate('/login')}>Login</Link>*/}

        <Button variant='secondary' onClick={logOut}>
          Log out
        </Button>
      </div>
    </div>
  );
})`
  &.header {
    align-items: center;

    padding: 20px 36px;

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
        column-gap: 5px;
        margin: 0;

        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        padding: 5px;
        border-radius: 30px;
        background: #ffffff;
      }
    }

    .right-part {
      display: flex;
      align-items: center;
      column-gap: 40px;
    }
  }
`;
