import { styled } from '@mui/system';
import React from 'react';
import classNames from 'classnames';

import { Modal, ModalProps } from '../../../components/Modal';
import { Typography } from '../../../components/Typography';
import { CloseButton } from '../../../components/CloseButton';

import { WhatAreYouLookingFor } from '../../InitialSetup/InitialSetupModal/InitialSetup.WhatAreYouLokingFor';
import { CreteAccountOrSignIn } from './CreteAccountOrSignIn';
import { SetCriteria } from './StartMatchingWithoutAccount.SetCriteria';

import { useCriteriaStore } from '../../../globalState/criteria';

import { LookingForType } from '../../SetCriteria/criteria.types';
import { LookingFor } from '../../SetCriteria/criteria.contants';

const animationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 1
  }
};

interface StartMatchingWithoutAccountModalProps extends ModalProps {
  closeStartMatching: () => any;
  visibilityStore: any[];
  onSigInClick: () => void;
  onCreateAccountClick: () => void;
  afterSetCriteria: () => any;
}
export const StartMatchingWithoutAccountModal = styled(
  ({
    visibilityStore,
    className,
    onSigInClick,
    onCreateAccountClick,
    closeStartMatching,
    afterSetCriteria
  }: StartMatchingWithoutAccountModalProps) => {
    const [visibility, setVisibility] = visibilityStore;

    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
      setStep(0);
    }, [visibility]);

    const [state, setState] = React.useState<{
      lookingFor?: LookingForType;
    }>({
      lookingFor: undefined
    });

    const criteriaStore = useCriteriaStore();

    const onLookingForChange = (lookingFor: LookingForType) => {
      setState((state) => ({ ...state, lookingFor }));
    };

    const onNext = () => {
      criteriaStore.setCriteria((criteria) => ({
        ...criteria,
        looking_for: state.lookingFor
      }));

      afterSetCriteria();
    };

    return (
      <>
        <Modal
          className={classNames('start-matching-without-account-modal', className)}
          open={visibility}
          onBackdropClick={closeStartMatching}>
          <div className='modal-header'>
            <Typography variant='body2'>Match preferences</Typography>

            <CloseButton size='large' onClick={closeStartMatching} />
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
                        onSigInClick();
                      }}
                      onCreateAccountClick={() => {
                        onCreateAccountClick();
                      }}
                      onBack={() => setStep((step) => step - 1)}
                    />
                  )}

                  {state.lookingFor === LookingFor.LookingForAPlace && (
                    <SetCriteria onNext={onNext} onBack={() => setStep((step) => step - 1)} />
                  )}
                </>
              ][step]
            }
          </div>
        </Modal>
      </>
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

      .modal-body {
        display: grid;
        overflow-y: auto;
      }
    }
  }
`;
