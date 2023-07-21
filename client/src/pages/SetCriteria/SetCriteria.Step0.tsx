import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Logo } from '../../components/Logo';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import * as yup from 'yup';
import { IconButton } from '../../components/IconButton';
import avatar from '../MyAccount/images/property.png';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { motion } from 'framer-motion';
import { Radio } from '../../components/Radio';
import { Button } from '../../components/Button';

export type Step0FormType = {
  lookingFor: 'Rent' | 'Sale';
};

export const step0Schema: ObjectSchema<Step0FormType> = yup.object().shape({
  lookingFor: yup.string().oneOf(['Rent', 'Sale']).required()
});

export interface SetCriteriaStep0 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<Step0FormType>;
  setCurrentStep: (currentStep: number) => void;
}

export const SetCriteriaStep0 = styled(
  ({ closeModal, className, form, setCurrentStep }: SetCriteriaStep0) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    return (
      <div className={`set-criteria-step-0 ${className}`}>
        <div className='header'>
          <Logo />
          <IconButton size='large' noBackground onClick={closeModal}>
            <Icon icon='close' size={12} />
          </IconButton>
        </div>
        <div className='content'>
          <div className='content-form'>
            <div className='avatar-box'>
              <img alt='avatar' src={avatar} className='avatar' />
              <Typography variant='body4'>I'm looking for a place</Typography>
              <Link>Change</Link>
            </div>
            <Typography variant='body2' className='field-title'>
              What type of transaction do you seek?
            </Typography>
            <div className='looking-for-container'>
              <Controller
                render={({ field }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1 }}
                      className={`looking-for-choice for-tenant ${field.value === 'Rent' ? 'active' : ''}`}
                      onClick={() => field.onChange({ target: { value: 'Rent' } })}>
                      <div className='indicators'>
                        <IconButton size='large'>
                          <Icon icon='key' size={26} />
                        </IconButton>
                        <Radio
                          value='Rent'
                          checked={form.getValues('lookingFor') === 'Rent'}
                          onChange={field.onChange}
                        />
                      </div>

                      <Typography variant='body4' className='title'>
                        I’m looking to rent a place
                      </Typography>
                      <Typography variant='body4' className='description'>
                        Select this option if you are looking to rent a house or an apartment.
                      </Typography>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1 }}
                      className={`looking-for-choice for-buyer ${field.value === 'Sale' ? 'active' : ''}`}
                      onClick={() => {
                        // field.onChange({ target: { value: 'Sale' } })
                      }}>
                      <div className='indicators'>
                        <IconButton size='large' noBackground>
                          <Icon icon='credit-card' />
                        </IconButton>
                        <Radio
                          value='Sale'
                          checked={field.value === 'Sale'}
                          onChange={() => {
                            // field.onChange()
                          }}
                        />
                      </div>

                      <Typography variant='body4' className='title'>
                        I’m looking to buy a place
                      </Typography>

                      <Typography variant='body4' className='description'>
                        Select this option if you are looking to buy a house or an apartment.
                      </Typography>
                    </motion.div>
                  </>
                )}
                name='lookingFor'
                control={form.control}
              />
            </div>
          </div>

          <Button disabled={!form.formState.isValid} onClick={() => setCurrentStep(1)}>
            Refine my search
          </Button>
        </div>
      </div>
    );
  }
)`
  &.set-criteria-step-0 {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 36px;
    }

    .content {
      display: grid;
      justify-items: center;
      padding: 48px;
      align-content: space-between;
      row-gap: 64px;

      .content-form {
        display: grid;
        justify-items: center;
      }

      .avatar-box {
        width: max-content;
        padding: 8px 24px 8px 8px;
        display: flex;
        align-items: center;
        column-gap: 16px;
        border-radius: 45px;
        box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.05);

        .avatar {
          border-radius: 50%;
          height: 64px;
          width: 64px;
        }

        font-weight: 600;
      }

      .field-title {
        margin-top: 64px;
      }

      .looking-for-container {
        margin-top: 64px;
        display: flex;
        gap: 24px;

        .looking-for-choice {
          border-radius: 16px;
          border: 2px solid #f3f4f5;
          box-sizing: border-box;
          padding: 24px;
          user-select: none;
          cursor: pointer;
          width: 324px;

          &.active {
            border: 2px solid #c0daff;
            background: #c0daff;
            .icon-button {
              background-color: #184d6d;
              color: white;
            }
          }

          .indicators {
            display: flex;
            justify-content: space-between;
          }

          .icon-button {
            background-color: #f3f4f5;
            color: black;
          }

          .title {
            font-weight: 700;
            font-size: 18px;
            margin-top: 24px;
          }

          .description {
            margin-top: 8px;
          }
        }
      }
    }
  }
`;
