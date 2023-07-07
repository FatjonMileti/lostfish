import { styled } from '@mui/system';
import React, { HTMLAttributes, MouseEventHandler } from 'react';

import { TransactionType } from './Mrd.TransactionType';
import { WhenDoYouWantToMove } from './Mrd.WhenDoYouWantToMove';
import { AreaOfInterest } from './Mrd.AreaOfInterest';
import { AnimatePresence, motion } from 'framer-motion';
import { useGlobalState } from '../../globalState';
import { Button } from '../../components/Button';

interface MinimumRequiredDetailsProps extends HTMLAttributes<HTMLDivElement> {
  startMatching: MouseEventHandler;
}
export const MinimumRequiredDetails = styled(({ className, startMatching }: MinimumRequiredDetailsProps) => {
  const {
    userDetails: [userDetails, setUserDetails]
  } = useGlobalState();

  const onTransactionTypeChange = async (transactionType: string) => {
    setUserDetails({ ...userDetails, transactionType });
  };

  const onWhenChange = async (when: string) => {
    setUserDetails({ ...userDetails, whenDoYouWantToMove: when });
  };

  const onAreaOfInterestChange = (newValue: string) => {
    setUserDetails({ ...userDetails, areaOfInterest: newValue });
  };

  return (
    <div
      className={`minimum-requirements ${className}`}
      style={{ alignContent: userDetails.transactionType ? 'flex-start' : 'center' }}>
      <TransactionType
        transactionType={userDetails.transactionType}
        onTransactionTypeChange={onTransactionTypeChange}
      />
      <AnimatePresence>
        {userDetails.transactionType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <WhenDoYouWantToMove onWhenChange={onWhenChange} value={userDetails.whenDoYouWantToMove} />
          </motion.div>
        )}

        {userDetails.whenDoYouWantToMove && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <AreaOfInterest
              areaOfInterest={userDetails.areaOfInterest}
              onAreaChange={onAreaOfInterestChange}
            />
          </motion.div>
        )}

        {userDetails.whenDoYouWantToMove && userDetails.areaOfInterest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Button onClick={startMatching}>Start matching</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})`
  &.minimum-requirements {
    padding-top: 24px;
    box-sizing: border-box;
    display: grid;
    justify-items: center;
    height: 100%;
    row-gap: 64px;
    align-content: center;
  }
`;
