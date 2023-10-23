import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import image from './45.png';
import multimedia from './start.svg';

export const SectionTwo = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='welcome'>
        <Typography className='perfect-match'>
          We use <span className='perfect-match-red'>Artificial Intelligence </span>
          to reimagine the real estate industry
        </Typography>
        <Typography variant='body4' className='texts'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          et dolore magna aliqua.
          <br />
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </Typography>
      </div>
      <div className='section-content'>
        <div className='img'>
          <div className='content'>
            <div className='multimedia'>
              {' '}
              <div className='icon'></div>{' '}
            </div>
            <Typography variant='body2'>How Lostfish works</Typography>
          </div>
        </div>
      </div>
    </div>
  );
})`
  & {
    display: grid;
    padding: 88px 36px;
    justify-content: center;
    align-items: center;
    gap: 48px;
    box-sizing: border-box;
    background-color: #F3F4F5;
    opacity: 1;
    position: relative;
    z-index: 1;

    .welcome {
      width: 904px;
      display: grid;
      justify-self: center;
      align-items: center;
      gap: 24px;

      .perfect-match {
        width: 672px;
        justify-self: center;
        text-align: center;
        font-size: 40px;
        font-weight: 400;
        line-height: 48px;

        .perfect-match-red {
          color: #e5155a;
        }
      }

      .texts {
        text-align: center;
        font-weight: 400;
      }
    }
    .section-content {
      width: 100%;
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

      .img {
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%), url(${image});
        margin: 0 auto;

        background-repeat: no-repeat;
        background-size: cover;

        display: grid;
        align-content: end;
        overflow: hidden;

        height: 40em;
        width: 63.75em;

        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.05);

        .content {
          display: flex;
          width: 100%;
          padding: 32px 24px;
          gap: 24px;
          box-sizing: border-box;
          background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 43.75%);

          .multimedia {
            display: flex;
            width: 5em;
            height: 5em;
            border-radius: 25000px;
            border: 2px solid #fff;
            padding: 24px;
            box-sizing: border-box;
            align-items: center;

            .icon {
              width: 2em;
              height: 2em;
              background-image: url(${multimedia});
              background-repeat: no-repeat;
              background-size: cover;
            }
          }

          .typography {
            display: flex;
            color: #fff;
            font-weight: 700;
            line-height: 48px;
            align-items: center;
          }
        }
      }
    }
  }
`;
