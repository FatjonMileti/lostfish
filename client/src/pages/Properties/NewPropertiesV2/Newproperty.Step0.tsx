import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../../components/Typography';
import avatar from '../../MyAccount/images/avatar1.svg';
import { motion } from 'framer-motion';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { Radio } from '../../../components/Radio';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';

export type Step0FormType = {
  lookingFor: 'Rent' | 'Sale';
};

export const step0Schema: ObjectSchema<Step0FormType> = yup.object().shape({
  lookingFor: yup.string().oneOf(['Rent', 'Sale']).required()
});

export interface NewPropertyStep0 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<Step0FormType>;
  setCurrentStep: (currentStep: number) => void;

  saveAsDraft: () => void;
}

export const NewPropertyStep0 = styled(
  ({ closeModal, className, form, setCurrentStep, saveAsDraft }: NewPropertyStep0) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    return (
      <div className={`new-property-step-0 ${className}`}>
        <div className='header'>
          <Logo />
          <div className='right-side'>
            <Button variant='secondary' onClick={saveAsDraft}>
              Save changes
            </Button>
            <IconButton size='large' noBackground onClick={closeModal}>
              <Icon icon='close' size={12} />
            </IconButton>
          </div>
        </div>
        <div className="container">
            <div className="left"></div>
        </div>

      </div>
    );
  }
)`
  &.new-property-step-0 {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto;
    background-color: #fff;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 36px 36px 16px 36px;

      .right-side {
        display: flex;
        column-gap: 32px;
        .button {
          color: #fff;
          background-color: #184D6D;
          border: 1px solid #184D6D;
          .icon {
            color: #e5155a;
          }
        }
      }
    }
    .container {
      width: 100%;
      padding: 32px 36px;
      display: grid;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
`;
