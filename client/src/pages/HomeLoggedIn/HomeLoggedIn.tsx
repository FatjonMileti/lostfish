import React from 'react';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { registerStore, useGlobalState } from '../../globalState';

import { Header } from './Header';
import { WhatAreYouLookingFor } from './WhatAreYouLookingFor';
import { MinimumRequiredDetails } from './MinimumRequiredDetails';
import { SelectAvatar } from '../WellcomeScreen/SelectAvatar';
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';

registerStore(
  'userDetails',
  {
    selectedAvatar: undefined,
    lookingFor: undefined,
    transactionType: undefined,
    whenDoYouWantToMove: undefined,
    areaOfInterest: undefined,
    startedMatching: false
  },
  { persist: true }
);

export const fakeAvatarService = {
  selectAvatar: async (avatarIndex: number) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('selectedAvatar', avatarIndex.toString());
        resolve(true);
      }, 1000);
    });
  },
  getSelectedAvatar: async (): Promise<undefined | number> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(parseInt(localStorage.getItem('selectedAvatar') || ''));
      }, 500);
    });
  }
};

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const {
    userDetails: [userDetails, setUserDetails]
  } = useGlobalState();

  const onSelectAvatar = async (selectedAvatar: number) => {
    setLoading(true);
    try {
      await fakeAvatarService.selectAvatar(selectedAvatar);
      setUserDetails({ ...userDetails, selectedAvatar });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onLookingForChange = async (lookingFor: string) => {
    try {
      setUserDetails({ ...userDetails, lookingFor });
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
    setUserDetails({ ...userDetails, startMatching: true });
    navigate('/matches');
  };

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header selectedAvatar={userDetails.selectedAvatar} />

      <Backdrop open={loading}></Backdrop>

      {userDetails.startMatching && <Button onClick={() => setUserDetails({})}>Reset</Button>}

      {!userDetails.startMatching && (
        <>
          <AnimatePresence>
            {userDetails.selectedAvatar === undefined && (
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
            {userDetails.selectedAvatar !== undefined && !userDetails.lookingFor && (
              <motion.div
                key='WhatAreYouLookingFor'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1
                }}>
                <WhatAreYouLookingFor
                  selectedAvatar={userDetails.selectedAvatar}
                  lookingFor={userDetails.lookingFor}
                  onLookingForChange={onLookingForChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {userDetails.selectedAvatar !== undefined && !!userDetails.lookingFor && (
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
