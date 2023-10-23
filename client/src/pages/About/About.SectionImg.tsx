import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { avatars } from '../HomeLoggedIn/avatars';
import image from './45.png';
import multimedia from './start.svg';

export const SectionImg = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
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
    width: 100%;
    display: flex;
    padding: 64px 36px;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    box-sizing: border-box;
    opacity: 1;
    position: relative;
    z-index: 1;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 45.83%);

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
