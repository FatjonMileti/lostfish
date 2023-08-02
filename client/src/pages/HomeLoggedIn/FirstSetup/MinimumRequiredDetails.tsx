import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Backdrop } from '../../../components/Backdrop';
import { Button } from '../../../components/Button';

import { TransactionType } from './Mrd.TransactionType';
import { WhenDoYouWantToMove } from './Mrd.WhenDoYouWantToMove';
import { AreaOfInterest } from './Mrd.AreaOfInterest';

import { useCriteriaStore } from '../../../globalState/criteria';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';

type MinimumRequiredDataType = {
  transactionType?: string;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
};

interface MinimumRequiredDetailsProps extends HTMLAttributes<HTMLDivElement> {}
export const MinimumRequiredDetails = styled(({ className }: MinimumRequiredDetailsProps) => {
  const [state, setState] = React.useState<MinimumRequiredDataType>({
    transactionType: undefined,
    whenDoYouWantToMove: undefined,
    areaOfInterest: undefined
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const { auth } = useUserStore();
  const criteriaStore = useCriteriaStore();

  const onTransactionTypeChange = async (transactionType: string) => {
    setState((state) => ({ ...state, transactionType }));
  };

  const onWhenChange = async (whenDoYouWantToMove: string) => {
    setState((state) => ({ ...state, whenDoYouWantToMove }));
  };

  const onAreaOfInterestChange = (areaOfInterest: string) => {
    setState((state) => ({ ...state, areaOfInterest }));
  };

  const startMatching = async () => {
    setLoading(true);

    // criteriaStore.set({
    //   transactionType: state.transactionType,
    //   whenDoYouWantToMove: state.whenDoYouWantToMove,
    //   areaOfInterest: state.areaOfInterest
    // });

    const { data } = await axios(auth.access_token).post('/api/criteria', {
      looking_for: criteriaStore.lookingFor,
      transaction_type_string: state.transactionType,
      moving_time: state.whenDoYouWantToMove,
      area_of_interest: state.areaOfInterest
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });

    criteriaStore.set({
      transactionType: data.transaction_type_string,
      whenDoYouWantToMove: data.moving_time,
      areaOfInterest: data.area_of_interest
    });

    setLoading(false);
    criteriaStore.set({ startedMatching: true });

    navigate('/matches');
  };

  return (
    <>
      <Backdrop open={loading}></Backdrop>
      <div
        className={`minimum-requirements ${className}`}
        style={{ alignContent: state.transactionType ? 'flex-start' : 'center' }}>
        <TransactionType
          transactionType={state.transactionType}
          onTransactionTypeChange={onTransactionTypeChange}
        />

        {state.transactionType && (
          <motion.div
            key='whenDoYouWantToMove'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}>
            <WhenDoYouWantToMove onWhenChange={onWhenChange} value={state.whenDoYouWantToMove} />
          </motion.div>
        )}

        {state.whenDoYouWantToMove && (
          <motion.div
            key='areaOfInterest'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}>
            <AreaOfInterest areaOfInterest={state.areaOfInterest} onAreaChange={onAreaOfInterestChange} />
          </motion.div>
        )}

        {state.whenDoYouWantToMove && state.areaOfInterest && (
          <motion.div
            key='startMatching'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}>
            <Button onClick={startMatching}>Start matching</Button>
          </motion.div>
        )}
      </div>
    </>
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
