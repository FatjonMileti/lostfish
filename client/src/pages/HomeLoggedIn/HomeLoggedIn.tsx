import React from 'react';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

import { Header } from './Header';
import { WhatAreYouLookingFor } from './FirstSetup/WhatAreYouLookingFor';
import { MinimumRequiredDetails } from './FirstSetup/MinimumRequiredDetails';
import { SelectAvatar } from '../WellcomeScreen/SelectAvatar';
import { Backdrop } from '../../components/Backdrop';
import axios from '../../utils/axios';
import { Footer } from '../Home/Footer';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';
import { useCriteriaStore } from '../../globalState/criteria';
import { SectionOne } from './HomeLoggedIn.SectionOne';
import { SectionTwo } from './HomeLoggedIn.SectionTwo';
import { SectionThree } from './HomeLoggedIn.SectionThree';
import { SectionFour } from './HomeLoggedIn.SectionFour';
import { SectionFive } from './HomeLoggedIn.SectionFive';
import { useNavigate } from 'react-router-dom';

import { refreshToken } from '../Login/SessionMaintainer';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
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
        navigate('/properties?newProperty=true');
      }

      setLoading(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      {isNaN(parseInt(profileStore.avatar || '')) ? (
        <motion.div
          key='SelectAvatar'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1
          }}>
          <SelectAvatar onSelectAvatar={onSelectAvatar} />
        </motion.div>
      ) : !criteriaStore.lookingFor ? (
        <motion.div
          key='WhatAreYouLookingFor'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1
          }}>
          <WhatAreYouLookingFor
            avatar={profileStore.avatar ? parseInt(profileStore.avatar) : 0}
            lookingFor={criteriaStore.lookingFor}
            onLookingForChange={onLookingForChange}
          />
        </motion.div>
      ) : criteriaStore.lookingFor === 'I own a place' ||
        (criteriaStore.lookingFor === 'I’m looking for a place' &&
          criteriaStore.transactionType &&
          criteriaStore.whenDoYouWantToMove &&
          criteriaStore.areaOfInterest) ? (
        <>
          <div className='container'>
            <>
              <SectionOne />
              <SectionTwo />
              <SectionThree />
              <SectionFour />
              <SectionFive />
            </>
          </div>
          <Footer />
        </>
      ) : (
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
  &.home-logged-in-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto min-content;
    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
    box-sizing: border-box;

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
