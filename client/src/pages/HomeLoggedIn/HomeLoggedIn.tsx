import React from 'react';
import { styled } from '@mui/system';
import { AnimatePresence, motion } from 'framer-motion';

import { Header } from './Header';
import { WhatAreYouLookingFor } from './WhatAreYouLookingFor';
import { MinimumRequiredDetails } from './MinimumRequiredDetails';
import { SelectAvatar } from '../WellcomeScreen/SelectAvatar';
import { Backdrop } from '../../components/Backdrop';
import axios from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';
import { useCriteriaStore } from '../../globalState/criteria';
import { NoWaitingSection } from './HomeLoggedIn.NoWaitingSection';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const { auth, userDetails } = useUserStore();
  const profileStore = useProfileStore();
  const criteriaStore = useCriteriaStore();

  const onSelectAvatar = async (avatar: number) => {
    setLoading(true);
    try {
      await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, {
        avatar: avatar
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
      criteriaStore.set({ lookingFor });
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header />

      <Backdrop open={loading}></Backdrop>

      <div className='container'>
        {criteriaStore.startedMatching && (
          <>
            <NoWaitingSection />
          </>
        )}
      </div>

      {/* <Button */}
      {/*   style={{ position: 'absolute', top: '128px', left: '36px' }} */}
      {/*   onClick={() => { */}
      {/*     profileStore.set({ avatar: undefined }); */}
      {/*     criteriaStore.set({ */}
      {/*       startedMatching: false, */}
      {/*       lookingFor: undefined, */}
      {/*       transactionType: undefined, */}
      {/*       whenDoYouWantToMove: undefined */}
      {/*     }); */}
      {/*   }}> */}
      {/*   Reset */}
      {/* </Button> */}

      {!criteriaStore.startedMatching && (
        <>
          {isNaN(parseInt(profileStore.avatar || '')) && (
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

          {!isNaN(parseInt(profileStore.avatar || '')) && !criteriaStore.lookingFor && (
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
          )}

          {!isNaN(parseInt(profileStore.avatar || '')) && !!criteriaStore.lookingFor && (
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
    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;

    .container {
      padding: 24px 36px;
    }
  }
`;
