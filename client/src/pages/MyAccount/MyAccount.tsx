import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// import { Icon } from '../../components/Icon';
import { Typography } from '../../components/Typography';

import { Dashboard } from './Dashboard/Dashboard';
import { ProfileDetails } from './ProfileDetails';
import { TransactionAgreement } from './TransactionAgreement';
import { TermsAndConditions } from './TermsAndConditions';
import { HelpAndSupport } from './HelpAndSupport';
import { Header } from '../HomeLoggedIn/Header';
import { Footer } from '../Home/Footer';

import request from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';

import { Avatar } from '../../components/Avatar';
import { avatars } from '../HomeLoggedIn/avatars';
import { ImproveTrustScoreModal } from '../PagesComponents/ImproveTrustScoreModal';
import { SetCriteria } from '../SetCriteria/SetCriteria/SetCriteria';
import { Properties } from '../Properties/Properties';
import { Solicitors } from './Solicitors';
import { Role } from '../../enums';
import { TenantsReviewHeader } from '../Matches/MatchesTenants/TenantsReviewHeader';
import { PropertiesReviewHeader } from '../Matches/MatchesProperties/PropertiesReviewHeader';
import { AccountItem } from '../../components/AccountItem.tsx';
import { AccountDetails } from './AccountDetails.tsx';

const submenus: any[] = [
  { icon: 'layer', text: 'Dashboard', link: '' },
  { icon: 'building', text: 'My Properties', link: '/properties' },
  { icon: 'settings', text: 'Account details', link: '/account-details' },
  { icon: 'settings', text: 'Plan and payment', link: '/plan-and-payment' },
  { icon: 'settings', text: 'Account settings', link: '/account-settings' },
  { icon: 'security', text: 'Transaction agreement', link: '/transaction-agreement' },
  { icon: 'file', text: 'Terms & Conditions', link: '/terms-and-conditions' },
  { icon: 'support', text: 'Help & Support', link: '/help-and-support' },
  { icon: 'user', text: 'Solicitors', link: '/solicitors' }
];

const tenantSubmenu: any[] = [
  { icon: 'layer', text: 'Dashboard', link: '' },
  { icon: 'settings', text: 'Account details', link: '/account-details' },
  { icon: 'settings', text: 'Plan and payment', link: '/plan-and-payment' },
  { icon: 'settings', text: 'Account settings', link: '/account-settings' },
  { icon: 'research', text: 'Refine your search', link: '/refine-your-search' },
  { icon: 'security', text: 'Transaction agreement', link: '/transaction-agreement' },
  { icon: 'file', text: 'Terms & Conditions', link: '/terms-and-conditions' },
  { icon: 'support', text: 'Help & Support', link: '/help-and-support' },
  { icon: 'user', text: 'Solicitors', link: '/solicitors' }
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
      profileStore.reset();
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
        <div className='header-and-content-wrapper'>
          <Header
            middleContent={
              <>
                {profileStore.role === Role.Landlord && <TenantsReviewHeader />}
                {profileStore.role === Role.Tenant && <PropertiesReviewHeader />}
              </>
            }
          />
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
                      Match score:
                    </Typography>
                    <Typography
                      variant='body4'
                      className='trust-score-percentage'
                      onClick={() => setImproveTrustScoreModalVisibility(true)}>
                      {profileStore.trust_score}%
                    </Typography>
                  </div>
                </div>
              </div>
              <div className='menu-body'>
                {(profileStore.role === 'Tenant' ? tenantSubmenu : submenus).map(
                  ({ icon, text, link }, menuItemIndex) => (
                    <NavLink end to={`/my-account${link}`} key={menuItemIndex}>
                      {({ isActive }) => <AccountItem active={isActive} label={text} icon={icon} />}
                    </NavLink>
                  )
                )}
                {/*{(profileStore.role === 'Tenant' ? tenantSubmenu : submenus).map(*/}
                {/*  ({ icon, text, link }, menuItemIndex) => (*/}
                {/*    <NavLink end to={`/my-account${link}`} key={menuItemIndex}>*/}
                {/*      {({ isActive }) => (*/}
                {/*        <motion.div*/}
                {/*          whileTap={{ scale: 0.98 }}*/}
                {/*          className={`menu-item ${isActive ? 'active' : ''}`}>*/}
                {/*          <Icon icon={icon} color='black' size={24} />*/}
                {/*          <Typography variant='body4' className='text'>*/}
                {/*            {text}*/}
                {/*          </Typography>*/}
                {/*        </motion.div>*/}
                {/*      )}*/}
                {/*    </NavLink>*/}
                {/*  )*/}
                {/*)}*/}
              </div>

              <div className='menu-footer'>
                <AccountItem className='sign-out' label='Sign out' icon='sign-out' onClick={logOut} />

                {/*<motion.div whileTap={{ scale: 0.98 }} className='menu-item' onClick={logOut}>*/}
                {/*  <Icon icon='sign-out' color='black' size={23} />*/}
                {/*  <Typography variant='body4' className='text'>*/}
                {/*    Sign out*/}
                {/*  </Typography>*/}
                {/*</motion.div>*/}
              </div>
            </div>
            <div className='line'></div>
            <div className='right-content'>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/account-details' element={<AccountDetails />} />

                <Route path='/account-settings' element={<ProfileDetails />} />
                {profileStore.role === 'Tenant' && (
                  <Route path='/refine-your-search' element={<SetCriteria />} />
                )}
                <Route path='/transaction-agreement' element={<TransactionAgreement />} />
                <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
                <Route path='/help-and-support' element={<HelpAndSupport />} />
                <Route path='/solicitors' element={<Solicitors />} />
                <Route path='/properties' element={<Properties />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
})`
  &.my-account-page {
    position: relative;
    display: grid;
    grid-template-rows: auto min-content;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;

      .container-account {
        display: grid;
        //column-gap: 69px;
        padding: 24px 36px 36px 36px;
        min-height: calc(100vh - 112px);
        box-sizing: border-box;

        grid-template-columns: 1fr min-content 2.79fr;

        .left-menu {
          display: grid;
          grid-template-rows: min-content auto min-content;
          row-gap: 32px;

          padding-right: 69px;
          background: white;

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

                :hover {
                  cursor: pointer;
                }
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

            //.menu-item {
            //  display: grid;
            //  grid-template-columns: min-content auto min-content;
            //  align-items: center;
            //  padding: 12px 14px;
            //  .text {
            //    margin-left: 10px;
            //  }
            //  .arrow {
            //    margin-left: 16px;
            //  }
            //
            //  &.active,
            //  :hover {
            //    background-color: #f7f1e7;
            //    border-radius: 8px;
            //    .text {
            //      font-weight: 600;
            //    }
            //  }
            //}
          }

          .menu-footer {
            .sign-out {
              color: #b4263b;
            }

            //.menu-item {
            //  color: #b4263b;
            //  display: grid;
            //  grid-template-columns: min-content auto;
            //  align-items: center;
            //  padding: 12px 14px;
            //  .text {
            //    margin-left: 10px;
            //  }
            //
            //  .icon {
            //    color: #b4263b;
            //  }
            //
            //  :hover {
            //    background-color: #f7f1e7;
            //    border-radius: 8px;
            //    cursor: pointer;
            //    .text {
            //      font-weight: 600;
            //    }
            //  }
            //}
          }

          .log-out-button {
            align-self: flex-end;
          }
        }

        .line {
          width: 2px;
          background-color: #f3f4f5;
        }

        .right-content {
          padding: 24px 0px 24px 24px;
          z-index: 0;
          position: relative;
        }
      }
    }
  }
`;
