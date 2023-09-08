import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Icon } from '../../components/Icon';
import { Typography } from '../../components/Typography';

import { Dashboard } from './Dashboard/Dashboard';
import { ProfileDetails } from './ProfileDetails';
import { AccountSettings } from './AccountSettings';
import { StarredMatches } from './StarredMatches/StarredMatches';
import { NotificationSettings } from './NotificationSettings';
import { TransactionAgreement } from './TransactionAgreement';
import { TermsAndConditions } from './TermsAndConditions';
import { HelpAndSupport } from './HelpAndSupport';
import { Header } from '../HomeLoggedIn/Header';
import request from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';

import { Avatar } from '../../components/Avatar';
import { avatars } from '../HomeLoggedIn/avatars';
import backgroundImg from '../Home/home-background.png';
import { Button } from '../../components/Button';
import { ImproveTrustScoreModal } from '../PagesComponents/ImproveTrustScoreModal';

const submenus: any[] = [
  { icon: 'layer', text: 'Summary', link: '' },
  { icon: 'star', text: 'Starred matches', link: '/starred-matches' },
  { icon: 'settings', text: 'Account settings', link: '/account-settings' },
  { icon: 'megaphone', text: 'Notification settings', link: '/notification-settings' },
  { icon: 'security', text: 'Transaction agreement', link: '/transaction-agreement' },
  { icon: 'file', text: 'Terms & Conditions', link: '/terms-and-conditions' },
  { icon: 'chat', text: 'Help & Support', link: '/help-and-support' }
];

export const MyAccount = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const profileStore = useProfileStore();
  const navigate = useNavigate();
  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);

  const logOut = async () => {
    try {
      await request(userStore.auth.access_token).post('/api/account/logout', {
        refresh_token: userStore.auth.refresh_token
      });
    } catch (err) {
    } finally {
      userStore.set((user: any) => ({ ...user, auth: null, userDetails: null, ability: null }));
      navigate('/');
    }
  };

  return (
    <>
      <ImproveTrustScoreModal
        open={improveTrustScoreModalVisibility}
        closeModal={() => setImproveTrustScoreModalVisibility(false)}
      />
      <div className={`my-account-page ${className}`}>
        <Header />
        <div className='container-account'>
          <div className='left-menu'>
            <div className='menu-header'>
              <Avatar
                image={profileStore.avatar ? avatars[parseInt(profileStore.avatar)]?.image : undefined}
              />

              <div>
                <Typography variant='body3' className='name'>
                  {`${profileStore.first_name} ${profileStore.last_name}`}
                </Typography>
                <div className='trust-score'>
                  <Typography variant='body4' className='trust-score-title'>
                    Trust score:
                  </Typography>
                  <Typography variant='body4' className='trust-score-percentage'>
                    {profileStore.trust_score}%
                  </Typography>
                </div>
              </div>
              <Button
                size='small'
                variant='secondary'
                inverted
                className='details-button'
                onClick={() => setImproveTrustScoreModalVisibility(true)}>
                Improve
              </Button>
            </div>
            <div className='menu-body'>
              {submenus.map(({ icon, text, link }, menuItemIndex) => (
                <NavLink end to={`/my-account${link}`} key={menuItemIndex}>
                  {({ isActive }) => (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`menu-item ${isActive ? 'active' : ''}`}>
                      <Icon icon={icon} color='black' size={20} />
                      <Typography variant='body4' className='text'>
                        {text}
                      </Typography>
                      {/*<Icon icon='chevron-right' color='black' className='arrow' size={14} />*/}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>

            <div className='menu-footer'>
              <motion.div whileTap={{ scale: 0.98 }} className='menu-item' onClick={logOut}>
                <Icon icon='sign-out' color='black' size={20} />
                <Typography variant='body4' className='text'>
                  Sign out
                </Typography>
              </motion.div>
            </div>
          </div>
          <div className='line'></div>
          <div>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/account-settings' element={<ProfileDetails />} />
              <Route path='/starred-matches' element={<StarredMatches />} />
              <Route path='/notification-settings' element={<NotificationSettings />} />
              <Route path='/transaction-agreement' element={<TransactionAgreement />} />
              <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
              <Route path='/help-and-support' element={<HelpAndSupport />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
})`
  &.my-account-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    background-color: white;

    grid-template-rows: min-content auto;
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: url(${backgroundImg});
      opacity: 0.05;

      background-size: auto;
      background-position-x: right;
      background-position-y: bottom;
      background-repeat: no-repeat;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;

      background-position-y: top;
      background-size: cover;
      z-index: -2;
    }

    .container-account {
      display: grid;
      column-gap: 69px;
      padding: 36px;

      grid-template-columns: 1fr min-content 2.79fr;

      .left-menu {
        display: grid;
        grid-template-rows: min-content auto min-content;
        row-gap: 32px;

        .menu-header {
          display: flex;
          column-gap: 16px;
          align-items: center;
          .avatar {
            height: 65px;
            width: 65px;
          }

          .name {
            font-weight: 700;
            font-size: 20px;
            color: #0d2a38;
          }

          .trust-score {
            display: flex;
            column-gap: 4px;
            .trust-score-title {
              color: #646464;
            }

            .trust-score-percentage {
              color: #e5155a;
              font-weight: 700;
            }
          }

          .details-button {
            padding: 12px 16px;
            gap: 8px;
            border: 2px solid #184d6d;
            color: #184d6d;
          }
        }

        .menu-body {
          display: flex;
          flex-direction: column;
          row-gap: 8px;
          > a {
            text-decoration: none;
            color: black;
          }

          .menu-item {
            display: grid;
            grid-template-columns: min-content auto min-content;
            align-items: center;
            padding: 12px 14px;
            .text {
              margin-left: 10px;
            }
            .arrow {
              margin-left: 16px;
            }

            &.active,
            :hover {
              background-color: #f7f1e7;
              border-radius: 8px;
              .text {
                font-weight: 600;
              }
            }
          }
        }

        .menu-footer {
          .menu-item {
            color: #b4263b;
            display: grid;
            grid-template-columns: min-content auto;
            align-items: center;
            padding: 12px 14px;
            .text {
              margin-left: 10px;
            }

            .icon {
              color: #b4263b;
            }

            :hover {
              background-color: #f7f1e7;
              border-radius: 8px;
              cursor: pointer;
              .text {
                font-weight: 600;
              }
            }
          }
        }

        .log-out-button {
          align-self: flex-end;
        }
      }

      .line {
        width: 2px;
        background-color: #f3f4f5;
      }
    }
  }
`;
