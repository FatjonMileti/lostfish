import React from 'react';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { registerStore, useGlobalState } from '../../globalState/globalState';

import { Header } from './Header';
import { WhatAreYouLookingFor } from './WhatAreYouLookingFor';
import { MinimumRequiredDetails } from './MinimumRequiredDetails';
import { SelectAvatar } from '../WellcomeScreen/SelectAvatar';
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';
import axios from '../../utils/axios';

import { useUserStore } from '../../globalState/user';

export interface userProfileType {
  avatar?: string;
  fetchProfile: (access_token: string) => Promise<void>;
}

export interface MatchCriteriaType {
  lookingFor?: string;
  transactionType?: string;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
  startedMatching: boolean;
}

const defaultMatchCriteria: MatchCriteriaType = {
  lookingFor: undefined,
  transactionType: undefined,
  whenDoYouWantToMove: undefined,
  areaOfInterest: undefined,
  startedMatching: false
};

registerStore<userProfileType>(
  'userProfile',
  {
    avatar: undefined,
    fetchProfile: async (access_token: string) => {
      try {
        await axios(access_token).get('/api/account/me');
      } catch (err) {
        throw err;
      }
    }
  },
  { persist: true }
);

registerStore('matchCriteria', defaultMatchCriteria, { persist: true });

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const {
    userProfile: [userProfile, setUserProfile],
    matchCriteria: [matchCriteria, setMatchCriteria]
  } = useGlobalState();

  const { auth, userDetails: ud } = useUserStore();

  console.log('ud: ', ud);

  const onSelectAvatar = async (avatar: number) => {
    setLoading(true);
    try {
      await axios(auth.access_token).patch('/api/user/' + ud.user_id, {
        avatar: avatar
      });

      setUserProfile({ ...userProfile, avatar: avatar });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onLookingForChange = async (lookingFor: string) => {
    try {
      setMatchCriteria({ ...matchCriteria, lookingFor });
    } catch (err) {
      throw err;
    }
  };

  const startMatching = async () => {
    setLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
    setLoading(false);
    setMatchCriteria({ ...matchCriteria, startMatching: true });
    navigate('/matches');
  };

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      {matchCriteria.startMatching && (
        <Button
          onClick={() => {
            setMatchCriteria({});
            setUserProfile({});
          }}>
          Reset
        </Button>
      )}

      {!matchCriteria.startMatching && (
        <>
          <AnimatePresence>
            {userProfile.avatar === undefined && (
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
          </AnimatePresence>

          <AnimatePresence>
            {userProfile.avatar !== undefined && !matchCriteria.lookingFor && (
              <motion.div
                key='WhatAreYouLookingFor'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1
                }}>
                <WhatAreYouLookingFor
                  avatar={userProfile.avatar}
                  lookingFor={matchCriteria.lookingFor}
                  onLookingForChange={onLookingForChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {userProfile.avatar !== undefined && !!matchCriteria.lookingFor && (
              <motion.div
                key='MinimumRequiredDetails'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1
                }}>
                <MinimumRequiredDetails startMatching={startMatching} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* <Footer /> */}
    </div>
  );
})`
  &.home-logged-in-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto; //min-content;
  }
`;
