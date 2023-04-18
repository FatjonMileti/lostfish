import styled from '@emotion/styled';
import { Typography } from '../../components/Typography';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';

import tenantImage from './tenant.png';
import imLookingForPlace from './imLookingForPlace.png';
import { keyframes } from '@emotion/react';

// Create the keyframes
const scale = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
`;

const scaleOut = keyframes`
  from {
    transform: scale(1.1);
  }

  to {
    transform: scale(1);
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

export const Intersection = styled(({ className = '' }) => {
  return (
    <div className={className}>
      <div className='looking-for-section'>
        <div className='circles'>
          <div className='circle first'>
            <Typography className='looking-for-text' variant='body4'>
              I’m looking for a place
            </Typography>
            <IconButton className='plus-button'>
              <Icon icon='plus' size={24} color='white' />
            </IconButton>
          </div>
          <div className='circle second'>
            <IconButton className='plus-button'>
              <Icon icon='plus' size={24} color='white' />
            </IconButton>
            <Typography className='looking-for-text' variant='body4'>
              I’m looking for a tenant
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
})`
  .looking-for-section {
    margin-top: 84px;

    display: flex;
    align-items: center;

    column-gap: 72px;
    justify-content: center;
    .typography {
      color: #184d6d;
    }

    .circles {
      width: 568px;
      height: 324px;
      position: relative;

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
          // animation: ${scaleOut} 0.5s;
          // animation-fill-mode: forwards;

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
          }

          .looking-for-text {
            position: absolute;
            bottom: calc(50% - 14px);
            left: -210px;
            border: none;
          }
        }

        &.second {
          background-blend-mode: darken;

          background-color: #eee0d3;
          background-image: url(${tenantImage});
          background-position: center;
          background-repeat: no-repeat;

          position: absolute;
          right: 0;

          // animation: ${scaleOut} 0.5s;
          // animation-fill-mode: forwards;

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
          }

          .looking-for-text {
            position: absolute;
            bottom: calc(50% - 14px);
            right: -223px;
            border: none;
          }
        }
      }
    }
  }
`;
