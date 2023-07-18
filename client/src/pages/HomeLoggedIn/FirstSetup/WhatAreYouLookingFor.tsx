import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';

import tenantImage from '../../Home/tenant.png';
import imLookingForPlace from '../../Home/imLookingForPlace.png';
import { keyframes } from '@emotion/react';
import React from 'react';
import { Button } from '../../../components/Button';
import { motion } from 'framer-motion';

import { avatars } from '../avatars';

// Create the keyframes
const scale = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
`;

const shapeChange = keyframes`
  from {
    clip-path: circle(50% at 125% 50%);
  }

  to {
    clip-path: circle(47% at 120% 50%);
  }
`;

const shapeChange2 = keyframes`
  from {
    clip-path: circle(50% at -25% 50%);
  }

  to {
    clip-path: circle(47% at -20% 50%);
  }
`;

export interface WhatAreYouLookingForProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar: number;
  lookingFor?: string;
  onLookingForChange: (lookingFor: string) => Promise<void>;
}

export const WhatAreYouLookingFor = styled(
  ({ className, lookingFor, onLookingForChange }: WhatAreYouLookingForProps) => {
    return (
      <div className={className}>
        <div className='looking-for-section'>
          <Typography variant='h3' className='title'>
            What are you looking for?
          </Typography>
          <Typography variant='body4' className='description'>
            Start your search by selection one of the options below.
          </Typography>
          <div className='circles'>
            <div className='circle first' onClick={() => onLookingForChange('I’m looking for a place')}>
              <Typography className='looking-for-text' variant='body4'>
                I’m looking for a place
              </Typography>
              <IconButton className='plus-button' inverted>
                <Icon icon='plus' size={24} color='white' />
              </IconButton>
            </div>
            <motion.div className='circle second' onClick={() => onLookingForChange('I own a place')}>
              <IconButton className='plus-button' inverted>
                <Icon icon='plus' size={24} color='white' />
              </IconButton>
              <Typography className='looking-for-text' variant='body4'>
                I own a place
              </Typography>
            </motion.div>
          </div>
          <div className='action-buttons'>
            <Button variant='secondary' onClick={() => onLookingForChange('I’m looking for a place')}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }
)`
  & {
    display: grid;
    padding: 48px;
    box-sizing: border-box;

    .looking-for-section {
      display: grid;
      align-items: center;

      column-gap: 72px;
      justify-content: center;
      justify-items: center;

      .description {
        margin-top: 16px;
      }

      .circles {
        width: 567px;
        height: 324px;
        position: relative;
        margin-top: 72px;

        .typography {
          color: #184d6d;
        }

        .circle {
          display: inline-block;
          border-radius: 50%;
          width: 324px;
          height: 324px;

          cursor: pointer;

          &.first {
            background-image: url(${imLookingForPlace});
            position: absolute;
            left: 0;

            :hover {
              z-index: 1;

              animation: ${scale} 0.5s;
              animation-fill-mode: forwards;

              &:before {
                animation: ${shapeChange} 0.5s;
                animation-fill-mode: forwards;
              }

              .looking-for-text {
                text-decoration: underline;
              }
            }

            &:before {
              background-color: white;
              width: 100%;
              height: 100%;
              content: '';
              position: absolute;
              border-radius: 50%;
              clip-path: circle(50% at 125% 50%);
            }

            .plus-button {
              position: absolute;
              bottom: calc(50% - 24px);
              left: -24px;
              background-color: #e5155a;
              border: none;
              :hover {
                color: white;
              }
            }

            .looking-for-text {
              position: absolute;
              bottom: calc(50% - 14px);
              //left: -231px;
              width: max-content;
              right: calc(100% + 50px);
              border: none;
              color: #a7a7a7;
            }
          }

          &.second {
            background-color: ${(props) => avatars[props.avatar].backgroundColor};

            background-image: url(${(props) => avatars[props.avatar].image});

            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;

            position: absolute;
            right: 0;

            :hover {
              z-index: 1;
              animation: ${scale} 0.5s;
              animation-fill-mode: forwards;
              &:before {
                animation: ${shapeChange2} 0.5s;
                animation-fill-mode: forwards;
              }

              .looking-for-text {
                text-decoration: underline;
              }
            }

            &:before {
              background-color: white;
              width: 100%;
              height: 100%;
              content: '';
              position: absolute;
              border-radius: 50%;
              clip-path: circle(50% at -25% 50%);
            }

            .plus-button {
              position: absolute;
              bottom: calc(50% - 24px);
              right: -24px;
              background-color: #e5155a;
              border: none;
              :hover {
                color: white;
              }
            }

            .looking-for-text {
              position: absolute;
              bottom: calc(50% - 14px);
              width: max-content;
              left: calc(100% + 50px);

              border: none;
              color: #a7a7a7;
            }
          }
        }
      }

      .action-buttons {
        margin-top: 72px;
        display: grid;
        justify-content: center;
      }
    }
  }
`;
