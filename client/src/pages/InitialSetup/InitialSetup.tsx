import React from 'react';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

import { Header } from '../HomeLoggedIn/Header';
import { WhatAreYouLookingFor } from './WhatAreYouLookingFor';
import { MinimumRequiredDetails } from './MinimumRequiredDetails';
import { SelectAvatar } from '../WellcomeScreen/SelectAvatar';
import { Backdrop } from '../../components/Backdrop';
import axios from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';
import { useCriteriaStore } from '../../globalState/criteria';

import { useNavigate } from 'react-router-dom';

import { refreshToken } from '../Login/SessionMaintainer';
import backgroundImg from '../Home/home-background.png';
import classNames from 'classnames';
import { Role } from '../../enums';

export const InitialSetup = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const userStore = useUserStore();
  const profileStore = useProfileStore();
  const criteriaStore = useCriteriaStore();
  const navigate = useNavigate();

  const onSelectAvatar = async (avatar: number) => {
    setLoading(true);
    try {
      await axios(userStore.auth.access_token).patch('/api/user/' + userStore.userDetails.user_id, {
        avatar: avatar.toString()
      });
      profileStore.set((profile) => ({ ...profile, avatar: avatar.toString() }));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onLookingForChange = async (lookingFor: string) => {
    try {
      setLoading(true);

      const { data } = await axios(userStore.auth.access_token).post('/api/criteria', {
        looking_for: lookingFor,
        transaction_type_string: criteriaStore.transactionType
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      criteriaStore.set({ lookingFor });

      await refreshToken(true);

      if (lookingFor === 'I own a place') {
        await onSelectAvatar(0);
        navigate('/properties?newProperty=true');
      }

      setLoading(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={classNames(className, 'initial-setup-page')}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      {!criteriaStore.lookingFor && (
        <motion.div
          key='WhatAreYouLookingFor'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1
          }}>
          <WhatAreYouLookingFor
            avatar={profileStore.avatar || ''}
            lookingFor={criteriaStore.lookingFor}
            onLookingForChange={onLookingForChange}
          />
        </motion.div>
      )}

      {profileStore.role === Role.Client && isNaN(parseInt(profileStore.avatar || '')) && (
        <motion.div
          key='SelectAvatar'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1
          }}>
          <SelectAvatar onSelectAvatar={onSelectAvatar} />
        </motion.div>
      )}

      {!isNaN(parseInt(profileStore.avatar || '')) &&
        criteriaStore.lookingFor &&
        !criteriaStore.areaOfInterest && (
          <motion.div
            key='MinimumRequiredDetails'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1
            }}>
            <MinimumRequiredDetails />
          </motion.div>
        )}
    </div>
  );
})`
  &.initial-setup-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto min-content;

    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(${backgroundImg}), lightgray 50% / cover no-repeat;
      opacity: 0.05;

      background-size: cover;
      background-position-y: center;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: linear-gradient(148deg, #fffbf3 18.95%, #fff 100%), #fff;

      background-position-y: top;
      background-size: cover;
      z-index: -2;
    }

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
