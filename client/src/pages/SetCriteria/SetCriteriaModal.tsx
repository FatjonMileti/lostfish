import { styled } from '@mui/system';
import React from 'react';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';

import { Modal, ModalProps } from '../../components/Modal';
import { Typography } from '../../components/Typography';
import { CloseButton } from '../../components/CloseButton';
import { Label } from '../../components/Label';
import { Icon } from '../../components/Icon';

import { SetCriteriaLocation } from './SetCriteria/SetCriteria.Location';
import { SetCriteriaHouseType } from './SetCriteria/SetCriteria.HouseType';
import { SetCriteriaBudget } from './SetCriteria/SetCriteria.Budged';
import { SetCriteriaHouseDetails } from './SetCriteria/SetCriteria.HouseDetails';

import { CriteriaFormType } from './criteria.types';

const animationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 1
  }
};

interface SetCriteriaModalProps extends ModalProps {
  onBack: () => void;
  afterRefineSearch: () => void | any;
  form: UseFormReturn<CriteriaFormType>;
  onStartMatchingClick: () => any;
}
export const SetCriteriaModal = styled(
  ({ className, onBack, afterRefineSearch, form, onStartMatchingClick, ...rest }: SetCriteriaModalProps) => {
    const [step, setStep] = React.useState(0);

    return (
      <Modal className={classNames('set-criteria-modal', className)} {...rest}>
        <div className='modal-header'>
          <Typography variant='body2'>Match preferences</Typography>

          <CloseButton
            size='large'
            onClick={async () => {
              onBack();
            }}
          />
        </div>

        <div className='modal-body'>
          <div className='step-content'>
            <AnimatePresence>
              {
                [
                  <SetCriteriaLocation key='SetCriteriaLocation' form={form} {...animationProps} />,
                  <SetCriteriaHouseType key='SetCriteriaHouseType' form={form} {...animationProps} />,
                  <SetCriteriaBudget key='SetCriteriaBudget' form={form} {...animationProps} />,
                  <SetCriteriaHouseDetails key='SetCriteriaHouseDetails' form={form} {...animationProps} />
                ][step]
              }
            </AnimatePresence>
          </div>
          <div className='section-footer'>
            <Label
              size='large'
              variant='secondary'
              className='next-button'
              onClick={() => {
                if (step > 0) {
                  setStep((step) => step - 1);
                } else {
                  onBack();
                }
              }}>
              <Icon icon='arrow-left' /> Back
            </Label>

            <Label
              special
              size='large'
              className={classNames('start-matching-button', { hide: step !== 3 })}
              onClick={onStartMatchingClick}>
              Start matching
            </Label>

            <Label
              size='large'
              className={classNames('next-button', { hide: step === 3 })}
              onClick={() => setStep((step) => step + 1)}>
              Next <Icon icon='arrow-right' />
            </Label>
          </div>
        </div>
      </Modal>
    );
  }
)`
  &.set-criteria-modal {
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
        display: grid;
        justify-items: center;
        grid-template-rows: auto min-content;

        .step-content {
          display: grid;
          justify-items: center;
          padding: 48px 36px;
          width: 100%;
          box-sizing: border-box;
        }

        .section-footer {
          width: 100%;

          display: grid;
          grid-template-columns: min-content min-content min-content;

          align-items: center;
          justify-content: space-between;
          padding: 24px 36px;
          box-sizing: border-box;

          .start-matching-button {
            transition: opacity 0.2s ease-in-out;
            visibility: visible;
            opacity: 1;
            &.hide {
              visibility: hidden;
              opacity: 0;
            }
          }

          .next-button {
            transition: opacity 0.2s ease-in-out;
            visibility: visible;
            opacity: 1;
            &.hide {
              visibility: hidden;
              opacity: 0;
            }
          }
        }
      }
    }
  }
`;
