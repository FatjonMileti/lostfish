import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import avatar from '../MyAccount/images/avatar1.svg';
import { motion } from 'framer-motion';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { Radio } from '../../components/Radio';
import { PropertyService } from './NewProperty';

export interface NewPropertyStep0 extends HTMLProps<HTMLDivElement> {
  closeModal: () => void;
  propertyService: PropertyService;
}

export const NewPropertyStep0 = styled(({ propertyService, closeModal, className }: NewPropertyStep0) => {
  return (
    <div className={`new-property-step-0 ${className}`}>
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
            <Typography variant='body4'>I own a place</Typography>
          </div>
          <Typography variant='body2' className='field-title'>
            What type of transaction do you seek?
          </Typography>

          <div className='looking-for-container'>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1 }}
              className={`looking-for-choice for-tenant ${
                propertyService.state.lookingFor === 0 ? 'active' : ''
              }`}
              onClick={() => propertyService.setLookingFor(0)}>
              <div className='indicators'>
                <IconButton size='large'>
                  <Icon icon='key' size={26} />
                </IconButton>
                <Radio checked={propertyService.state.lookingFor === 0} />
              </div>

              <Typography variant='body4' className='title'>
                I’m looking for a tenant
              </Typography>
              <Typography variant='body4' className='description'>
                Select this option if you are looking to rent a house or an apartment.
              </Typography>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1 }}
              className={`looking-for-choice for-buyer ${
                propertyService.state.lookingFor === 1 ? 'active' : ''
              }`}
              onClick={() => propertyService.setLookingFor(1)}>
              <div className='indicators'>
                <IconButton size='large' noBackground>
                  <Icon icon='credit-card' />
                </IconButton>
                <Radio checked={propertyService.state.lookingFor === 1} />
              </div>

              <Typography variant='body4' className='title'>
                I’m looking for a buyer
              </Typography>

              <Typography variant='body4' className='description'>
                Select this option if you are looking to buy a house or an apartment.
              </Typography>
            </motion.div>
          </div>
        </div>

        <Button onClick={() => propertyService.setCurrentStep(1)}>Refine my search</Button>
      </div>
    </div>
  );
})`
  &.new-property-step-0 {
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
      row-gap: 48px;

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
