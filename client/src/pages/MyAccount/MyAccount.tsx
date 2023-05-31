import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Header } from '../HomeLoggedIn/Header';
import request from '../../utils/axios';
import { useGlobalState } from '../../globalState';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { motion } from 'framer-motion';

import { Dashbaord } from './Dashbaord';
import { ProfileDetails } from './ProfileDetails';
import { AccountSettings } from './AccountSettings';

export const MyAccount = styled(({ className }: HTMLProps<HTMLDivElement>) => {
  const {
    user: [user, setUser]
  } = useGlobalState();

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await request(user.auth.access_token).post('/api/account/logout', {
        refresh_token: user.auth.refresh_token
      });
    } catch (err) {
    } finally {
      setUser((user: any) => ({ ...user, auth: null }));
      navigate('/');
    }
  };

  return (
    <div className={`my-account-page ${className}`}>
      <Header />
      <div className='container'>
        <div className='left-menu'>
          <div className='menu-header'>
            <div className='avatar'></div>

            <div>
              <Typography variant='body3' className='name'>
                John Doe
              </Typography>
              <div className='trust-score'>
                <Typography variant='body4' className='trust-score-title'>
                  Trust score:
                </Typography>
                <Typography variant='body4' className='trust-score-percentage'>
                  60%
                </Typography>
              </div>
            </div>
          </div>
          <div className='menu-body'>
            {[
              { icon: 'dashboard', text: 'Dashboard', link: '' },
              { icon: 'user', text: 'Profile details', link: '/profile-details' },
              { icon: 'settings', text: 'Account settings', link: '/account-settings' },
              { icon: 'star', text: 'Starred matches', link: '/starred-matches' },
              { icon: 'megaphone', text: 'Notification settings', link: '/notificationSettings' },
              { icon: 'security', text: 'Transaction agreement', link: '/transaction-agreement' },
              { icon: 'file', text: 'Terms & Conditions', link: '/terms-and-conditions' },
              { icon: 'chat', text: 'Help & Support', link: '/help-and-support' }
            ].map(({ icon, text, link }, menuItemIndex) => (
              <NavLink end to={`/my-account${link}`} key={menuItemIndex}>
                {({ isActive }) => (
                  <motion.div whileTap={{ scale: 0.98 }} className={`menu-item ${isActive ? 'active' : ''}`}>
                    <Icon icon={icon} color='black' size={20} />
                    <Typography variant='body4' className='text'>
                      {text}
                    </Typography>
                    <Icon icon='chevron-right' color='black' className='arrow' size={14} />
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
            <Route path='/' element={<Dashbaord />} />
            <Route path='/profile-details' element={<ProfileDetails />} />
            <Route path='/account-settings' element={<AccountSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
})`
  &.my-account-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    background-color: white;

    grid-template-rows: min-content auto;

    .container {
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
            border-radius: 50%;
            background-color: #c0daff;
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
            display: grid;
            grid-template-columns: min-content auto;
            align-items: center;
            padding: 12px 14px;
            .text {
              margin-left: 10px;
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
