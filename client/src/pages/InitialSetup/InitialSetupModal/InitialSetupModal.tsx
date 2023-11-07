import { styled } from '@mui/system';
import classNames from 'classnames';
import React from 'react';
import axios from '../../../utils/axios';

import { useProfileStore } from '../../../globalState/profile';
import { useCriteriaStore } from '../../../globalState/criteria';
import { useUserStore } from '../../../globalState/user';
import { AnimatePresence } from 'framer-motion';

import { SelectAvatar } from './InitialSetup.SelectAvatar';
import { WhatAreYouLookingFor } from './InitialSetup.WhatAreYouLokingFor';
import { AddProperty } from './InitialSetup.AddProperty';
import { SetCriteria } from './InitialSetup.SetCriteria';

import { Backdrop } from '../../../components/Backdrop';
import { Modal, ModalProps } from '../../../components/Modal';
import { CloseButton } from '../../../components/CloseButton';
import { Typography } from '../../../components/Typography';

import { LookingFor, Transaction } from '../../SetCriteria/criteria.contants';
import { refreshToken } from '../../Login/SessionMaintainer';

interface InitialSetupModalProps extends ModalProps {}

const animationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 1
  }
};
export const InitialSetupModal = styled(({ className }: InitialSetupModalProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState(0);

  const profileStore = useProfileStore();
  const userStore = useUserStore();

  const [state, setState] = React.useState({
    avatar: '0',
    lookingFor: ''
  });

  const onLookingForNext = async () => {
    setLoading(true);
    try {
      await axios(userStore.auth.access_token).patch('/api/user/' + userStore.userDetails.user_id, {
        avatar: state.avatar
      });
      await axios(userStore.auth.access_token).post('/api/criteria', {
        looking_for: state.lookingFor,
        transaction_type_string: Transaction.Rent
      });

      profileStore.set((profile) => ({ ...profile, avatar: state.avatar }));
      setStep((step) => step + 1);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onAvatarNext = () => {
    setStep((step) => step + 1);
  };

  const setAvatar = (avatar: string) => {
    setState((state) => ({ ...state, avatar }));
  };

  const onLookingForChange = (lookingFor: string) => {
    setState((state) => ({ ...state, lookingFor }));
  };

  return (
    <Modal className={classNames('initial-setup-modal', className)} open={open}>
      <Backdrop open={loading}></Backdrop>
      <div className='modal-header'>
        <Typography variant='body2'>Match preferences</Typography>
        {step >= 2 && (
          <CloseButton
            size='large'
            onClick={async () => {
              await refreshToken(true);
              setOpen(false);
            }}
          />
        )}
      </div>
      <div className='modal-body'>
        <AnimatePresence>
          {
            [
              <SelectAvatar
                key='SelectAvatar'
                {...animationProps}
                avatar={state.avatar}
                setAvatar={setAvatar}
                onNext={onAvatarNext}
              />,
              <WhatAreYouLookingFor
                key='whatAreYouLookingFor'
                {...animationProps}
                lookingFor={state.lookingFor}
                onLookingForChange={onLookingForChange}
                onNext={onLookingForNext}
              />,
              <>
                {state.lookingFor === LookingFor.OwnAPlace && (
                  <AddProperty
                    key='AddProperty'
                    {...animationProps}
                    afterAddProperty={async () => {
                      await refreshToken(true);
                      setOpen(false);
                    }}
                    onBack={() => setStep((step) => step - 1)}
                  />
                )}

                {state.lookingFor === LookingFor.LookingForAPlace && (
                  <SetCriteria
                    key='SetCriteria'
                    {...animationProps}
                    onNext={async () => {
                      await refreshToken(true);
                      setOpen(false);
                    }}
                    onBack={() => setStep((step) => step - 1)}
                  />
                )}
              </>
            ][step]
          }
        </AnimatePresence>
      </div>
    </Modal>
  );
})`
  &.initial-setup-modal {
    width: 100vw;
    height: 100vh;

    position: relative;
    overflow: hidden;
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw;

    border-radius: 0;

    .modal-container {
      padding: 0 !important;
      display: grid;
      grid-template-rows: max-content auto;
      background: #fff;

      .modal-header {
        padding: 23px 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 2px solid #f3f4f5;
      }

      .modal-body {
        overflow-y: auto;
      }
    }
  }
`;
