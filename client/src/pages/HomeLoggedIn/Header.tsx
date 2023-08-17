import React from 'react';
import { styled } from '@mui/system';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAbility } from '@casl/react';

import { useProfileStore } from '../../globalState/profile';
import { AbilityContext } from '../../context/AbilityContext';
import { CASLAction } from '../../utils/ability.util';

import { MenuButton } from '../../components/MenuButton';
import { CircularProgress } from '../../components/CircularProgress';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { getAvatarFormIndex } from './avatars';

import lostfishLogoColored from '../../assets/svg/LogoLostFishColored.svg';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();

  const profileStore = useProfileStore();

  const ability = useAbility(AbilityContext);

  const canReadPropertyMenuItem = ability.can(CASLAction.Read, 'Menu', 'Property');
  const canReadMatchesMenuItem = ability.can(CASLAction.Read, 'Menu', 'Match');
  const canReadMessageMenuItem = ability.can(CASLAction.Read, 'Menu', 'Message');

  const trustScore = profileStore.trust_score;

  return (
    <div className={`header ${className}`}>
      <img className='logo' src={lostfishLogoColored} alt='Lostfish logo' onClick={() => navigate('/')} />

      <div className='middle-part'>
        <div className='menu'>
          <NavLink to='/'>{({ isActive }) => <MenuButton active={isActive}>Home</MenuButton>}</NavLink>
          {canReadMatchesMenuItem && (
            <NavLink to='/matches'>
              {({ isActive }) => <MenuButton active={isActive}>Matches</MenuButton>}
            </NavLink>
          )}
          {canReadPropertyMenuItem && (
            <NavLink to='/properties'>
              {({ isActive }) => <MenuButton active={isActive}>Properties</MenuButton>}
            </NavLink>
          )}
          {canReadMessageMenuItem && (
            <NavLink to='/messages'>
              {({ isActive }) => <MenuButton active={isActive}>Messages</MenuButton>}
            </NavLink>
          )}
        </div>
      </div>

      <div className='right-part'>
        <div className='trust-score'>
          <Typography variant='body6' className='trust-score-title'>
            Trust score
          </Typography>
          <Typography variant='body5' className='trust-score-percentage'>
            {trustScore}%
          </Typography>
        </div>

        <NavLink to='/my-account'>
          <div className='avatar-wrapper'>
            <CircularProgress
              className='circular-percentage'
              variant='determinate'
              value={trustScore}
              size='64px'
            />
            <Avatar image={getAvatarFormIndex(profileStore.avatar) || undefined} />
          </div>
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

    .logo {
      height: 64px;
      width: auto;
      cursor: pointer;
    }

    .middle-part {
      .menu {
        list-style: none;
        a {
          text-decoration: none;
        }

        display: flex;
        column-gap: 32px;
        align-items: center;
        margin: 0;
        padding: 5px;
      }
    }

    .right-part {
      display: flex;
      align-items: center;
      column-gap: 8px;

      .avatar-wrapper {
        position: relative;
        z-index: 0;
        height: 64px;
        width: 64px;
        display: grid;
        align-items: center;
        justify-content: center;

        .avatar {
          height: 56px;
          width: 56px;
        }

        .circular-percentage {
          position: absolute;
          inset: 0;
          color: #e5155a;
          z-index: -1;
        }
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
