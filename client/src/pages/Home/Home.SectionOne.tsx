import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import rightContentImg from './home.section1.png';
import classNames from 'classnames';

import backgroundImg from './forest.jpeg';
export const SectionOne = styled(
  ({
    className,
    section2Ref,
    onStartMatchingClick
  }: HTMLAttributes<HTMLDivElement> & {
    section2Ref?: React.RefObject<HTMLDivElement>;
    onStartMatchingClick: () => void;
  }) => {
    return (
      <div className={classNames('section-one', className)}>
        <div className='left-content'>
          <div className='welcome'>
            <Typography className='perfect-match'>Leveraging real estate through algorithms.</Typography>
            <Typography variant='body4' className='texts'>
              We use the power of Artificial Intelligence to find landlords and tenants exactly what they{' '}
              <br /> are looking for: The perfect match for their home or the perfect home for their match.
            </Typography>
          </div>

          <div className='refine-search'>
            <Label
              variant='special'
              size='large'
              className='action-button'
              onClick={onStartMatchingClick}
              >
              Start matching
            </Label>
            <Label
              variant='secondary'
              size='large'
              className='action-button'
              onClick={() => section2Ref?.current?.scrollIntoView({ behavior: 'smooth' })}>
              Scroll down <Icon icon='arrow-right' size={24} />
            </Label>
          </div>
        </div>
        <div className='right-content'></div>
      </div>
    );
  }
)`
  &.section-one {
    position: relative;
    min-height: calc(100vh - 96px);
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 48px 36px;
    justify-content: space-between;
    box-sizing: border-box;
    column-gap: 56px;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 251, 243, 0.9) 20%, rgba(255, 255, 255, 0.9) 100%)
        no-repeat;
      z-index: -1;
      top: -96px;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${backgroundImg});
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.4;
      z-index: -2;
      top: -96px;
    }

    .left-content {
      display: grid;
      justify-content: center;
      height: min-content;
      align-self: center;
      min-width: 672px;
      gap: 40px;

      .welcome {
        display: grid;
        align-items: center;
        gap: 24px;

        .perfect-match {
          font-size: 64px;
          font-weight: 600;
          line-height: 72px;
        }

        .texts {
          font-weight: 500;
        }
      }

      .refine-search {
        width: max-content;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        gap: 16px;
        border-radius: 25000px;

        .action-button {
          .icon {
            rotate: 90deg;
          }
        }
      }
    }

    .right-content {
      background-image: url(${rightContentImg});
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      width: 100%;
    }
  }
`;
