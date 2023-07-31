import React from 'react';
import { styled } from '@mui/system';
import { NavLink, useNavigate } from 'react-router-dom';
import Can from '../../components/Can';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/Avatar';

import { avatars } from './avatars';
import { useProfileStore } from '../../globalState/profile';
import { CASLAction } from '../../utils/ability.util';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();

  const profileStore = useProfileStore();

  return (
    <div className={`header ${className}`}>
      <div className='left-part' onClick={() => navigate('/')}>
        <Icon icon='lost-fish-yang' size={64} />
      </div>

      <div className='middle-part'>
        <Can do={CASLAction.Read} on='Menu'>
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
        </Can>
        <Can do={CASLAction.Read} on='AdminMenu'>
          <div className='menu'>
            <NavLink to='/dashboard'>
              {({ isActive }) => (
                <Button active={isActive} inverted>
                  Sessions
                </Button>
              )}
            </NavLink>
            <NavLink to='/agent-matches'>
              {({ isActive }) => (
                <Button active={isActive} inverted>
                  Matches
                </Button>
              )}
            </NavLink>
            <NavLink to='/agent-property'>
              {({ isActive }) => (
                <Button active={isActive} inverted>
                  Properties
                </Button>
              )}
            </NavLink>
            <NavLink to='/contracts'>
              {({ isActive }) => (
                <Button active={isActive} inverted>
                  Contract
                </Button>
              )}
            </NavLink>
          </div>
        </Can>
      </div>

      <div className='right-part'>
        <div className='trust-score'>
          <Typography variant='body6' className='trust-score-title'>
            Trust score
          </Typography>
          <Typography variant='body5' className='trust-score-percentage'>
            60%
          </Typography>
        </div>

        <NavLink to='/my-account'>
          <Avatar image={profileStore.avatar ? avatars[parseInt(profileStore.avatar)]?.image : undefined} />
        </NavLink>
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
      cursor: pointer;
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
      column-gap: 8px;

      .avatar {
      }

      .trust-score {
        .trust-score-title {
          font-size: 10px;
          line-height: 12px;
          font-weight: 500;
          color: #646464;
        }

        .trust-score-percentage {
          line-height: 14px;
          font-weight: 700;
          color: #e5155a;
        }
      }
    }
  }
`;
