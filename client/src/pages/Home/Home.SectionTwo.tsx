import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Typography } from '../../components/Typography';

import image from './video_screenshot.png';
import multimedia from './start.svg';

export const SectionTwo = styled(
  React.forwardRef<HTMLDivElement>(({ className }: HTMLAttributes<HTMLDivElement>, ref) => {
    return (
      <div className={classNames('home-section-two', className)} ref={ref}>
        <div className='section-content'>
          <div className='content'>
            <div className='multimedia'>
              <div className='icon' style={{ backgroundImage: `url("${multimedia}")` }}></div>
            </div>
            {/*<Typography variant='body3' className='video-title'>*/}
            {/*  How Lostfish uses AI to find your perfect match*/}
            {/*</Typography>*/}
          </div>
        </div>
        <div className='title'>
          <Typography variant='body2' className='perfect-match'>
            We use <span className='perfect-match-red'>Artificial Intelligence </span>
            to reimagine the real estate industry.
          </Typography>
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
            <br />
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </Typography>
        </div>
      </div>
    );
  })
)`
  &.home-section-two {
    display: grid;
    padding: 48px 36px;
    justify-items: center;
    align-items: center;
    gap: 48px;
    box-sizing: border-box;
    background-color: #fff;
    opacity: 1;
    position: relative;
    z-index: 1;

    .title {
      display: grid;
      justify-self: center;
      gap: 24px;

      .perfect-match {
        font-weight: 600;
        line-height: 48px;

        .perfect-match-red {
          color: #e5155a;
        }
      }

      .description {
        text-align: center;
        font-weight: 500;
      }
    }
    .section-content {
      display: grid;
      align-items: center;
      gap: 48px;

      border-radius: 16px;
      background: url(${image});
      max-width: 1136px;
      width: 100%;
      background-repeat: no-repeat;
      box-shadow: 0px 4px 32px 0px rgba(13, 42, 56, 0.1);
      background-size: cover;
      aspect-ratio: 1.77 / 1;

      .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 24px;
        gap: 16px;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;

        .multimedia {
          border-radius: 50%;
          border: 2px solid #e7e7e7;
          padding: 10px;
          box-sizing: border-box;
          align-items: center;

          .icon {
            width: 1.5em;
            height: 1.5em;
            //background-image: url(${multimedia});
            background-repeat: no-repeat;
            background-size: cover;
          }
        }

        .video-title {
          color: #fff;
          font-weight: 900;
        }
      }
    }
  }
`;
