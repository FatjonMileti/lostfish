import React from 'react';
import { styled } from '@mui/system';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../globalState/profile';

import { MenuButton } from '../../components/MenuButton';
import { CircularProgress } from '../../components/CircularProgress';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { getAvatarFormIndex } from './avatars';

import lostfishLogoColored from '../../assets/svg/LogoLostFishColored.svg';
import { Role } from '../../enums';
import { useNotificationsStore } from '../../globalState/notifications';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = styled(({ className }: HeaderProps) => {
  const navigate = useNavigate();
  const profileStore = useProfileStore();
  const notificationsStore = useNotificationsStore();

  return (
    <div className={`header ${className}`}>
      <img className='logo' src={lostfishLogoColored} alt='Lostfish logo' onClick={() => navigate('/')} />

      <div className='middle-part'>
        {profileStore.hasCompletedInitialSetup && (
          <div className='menu'>
            <NavLink to='/'>
              {({ isActive }) => <MenuButton active={isActive}>My dashboard</MenuButton>}
            </NavLink>

            <NavLink to='/matches'>
              {({ isActive }) => <MenuButton active={isActive}>Matches</MenuButton>}
            </NavLink>

            {profileStore.role === Role.Landlord && (
              <NavLink to='/properties'>
                {({ isActive }) => <MenuButton active={isActive}>Properties</MenuButton>}
              </NavLink>
            )}

            <NavLink to='/messages'>
              {({ isActive }) => (
                <div>
                  <MenuButton active={isActive}>
                    <div className='messages-button-content'>
                      Messages
                      {notificationsStore.unreadMessages > 0 && (
                        <span className='unread-messages-indicator' />
                      )}
                    </div>
                  </MenuButton>
                </div>
              )}
            </NavLink>
          </div>
        )}
      </div>

      <div className='right-part'>
        <div className='trust-score'>
          <Typography variant='body6' className='trust-score-title'>
            Match score
          </Typography>
          <Typography variant='body5' className='trust-score-percentage'>
            {profileStore.trust_score}%
          </Typography>
        </div>

        <NavLink to='/my-account'>
          <div className='avatar-wrapper'>
            <CircularProgress
              className='circular-percentage'
              variant='determinate'
              value={profileStore.trust_score}
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

        .messages-button-content {
          display: flex;
          align-items: center;
          column-gap: 4px;
          .unread-messages-indicator {
            width: 8px;
            height: 8px;
            background-color: #b4263b;
            border-radius: 50%;
          }
        }
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
