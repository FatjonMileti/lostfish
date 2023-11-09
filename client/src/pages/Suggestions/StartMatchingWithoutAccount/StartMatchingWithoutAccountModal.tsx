import { styled } from '@mui/system';
import { Modal, ModalProps } from '../../../components/Modal';
import React from 'react';
import classNames from 'classnames';

import { Backdrop } from '../../../components/Backdrop';
import { Typography } from '../../../components/Typography';
import { CloseButton } from '../../../components/CloseButton';

import { WhatAreYouLookingFor } from '../../InitialSetup/InitialSetupModal/InitialSetup.WhatAreYouLokingFor';
import { CreteAccountOrSignIn } from './CreteAccountOrSignIn';
import { LookingFor } from '../../SetCriteria/criteria.contants';
import { SetCriteria } from './StartMatchingWithoutAccount.SetCriteria';

const animationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 1
  }
};

interface StartMatchingWithoutAccountModalProps extends ModalProps {
  visibilityStore: any[];
  onSigInClick: () => void;
  onCreateAccountClick: () => void;
}
export const StartMatchingWithoutAccountModal = styled(
  ({
    visibilityStore,
    className,
    onSigInClick,
    onCreateAccountClick
  }: StartMatchingWithoutAccountModalProps) => {
    const [visibility, setVisibility] = visibilityStore;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [step, setStep] = React.useState(0);
    const [state, setState] = React.useState({
      lookingFor: ''
    });

    const onLookingForChange = (lookingFor: string) => {
      setState((state) => ({ ...state, lookingFor }));
    };

    return (
      <Modal
        className={classNames('start-matching-without-account-modal', className)}
        open={visibility}
        onBackdropClick={() => setVisibility(false)}>
        <Backdrop open={loading}></Backdrop>
        <div className='modal-header'>
          <Typography variant='body2'>Match preferences</Typography>

          <CloseButton
            size='large'
            onClick={async () => {
              setVisibility(false);
            }}
          />
        </div>
        <div className='modal-body'>
          {
            [
              <WhatAreYouLookingFor
                key='whatAreYouLookingFor'
                {...animationProps}
                lookingFor={state.lookingFor}
                onLookingForChange={onLookingForChange}
                onNext={() => {
                  setStep((step) => step + 1);
                }}
              />,
              <>
                {state.lookingFor === LookingFor.OwnAPlace && (
                  <CreteAccountOrSignIn
                    onSignInClick={() => {
                      setVisibility(false);
                      onSigInClick();
                    }}
                    onCreateAccountClick={() => {
                      setVisibility(false);
                      onCreateAccountClick();
                    }}
                  />
                )}

                {state.lookingFor === LookingFor.LookingForAPlace && (
                  <SetCriteria
                    onNext={() => {}}
                    onBack={() => {
                      setStep((step) => step - 1);
                    }}
                  />
                )}
              </>
            ][step]
          }
        </div>
      </Modal>
    );
  }
)`
  &.start-matching-without-account-modal {
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
    }
  }
`;
