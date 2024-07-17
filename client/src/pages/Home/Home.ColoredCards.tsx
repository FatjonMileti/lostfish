import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Typography, Button } from '../../components';

import { useUserStore } from '../../globalState/user';

import image1 from './paper1.png';
import image2 from './paper2.png';
import image3 from './paper3.png';

export const ColoredCards = styled(
  ({
    className,
    onCreateAccountClick = () => {}
  }: HTMLAttributes<HTMLDivElement> & {
    onCreateAccountClick?: () => void;
  }) => {
    const userStore = useUserStore();
    return (
      <div className={classNames('colored-cards', className)}>
        <div className='section-content-wrapper'>
          <div className='images'>
            <div className='image image-1'>
              <div className='content'>
                <Typography variant='body3' className='title'>
                  What really is AI?
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
              </div>
            </div>
            <div className='image image-2'>
              <div className='content'>
                <Typography variant='body3' className='title'>
                  Why AI?
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
              </div>
            </div>
            <div className='image image-3'>
              <div className='content'>
                <Typography variant='body3' className='title'>
                  How to get started
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
                <Typography variant='body4' className='description'>
                  Our goal is to increase transparency and trust in the process to achieve the best results
                  for customers in a quick, calm, and informed manner.
                </Typography>
              </div>
            </div>
          </div>
          {!userStore.auth ? (
            <Button variant='primary' size='large' className='create-account' onClick={onCreateAccountClick}>
              Create account
            </Button>
          ) : (
            <Button
              variant='primary'
              size='large'
              className='create-account'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Review matches
            </Button>
          )}
        </div>
      </div>
    );
  }
)`
  &.colored-cards {
    display: grid;

    background: #f7f1e7;
    box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.1) inset;
    justify-content: center;

    .section-content-wrapper {
      box-sizing: border-box;
      padding: 64px 36px;
      display: grid;
      max-width: 1440px;
      gap: 48px;
    }

    .images {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: flex-start;
      gap: 24px;

      .image-1 {
        background-image: url(${image1});

        .content {
          background: linear-gradient(180deg, rgba(229, 21, 90, 0.8) 0%, rgba(13, 42, 56, 0.8) 80%);
        }
      }

      .image-2 {
        background-image: url(${image2});

        .content {
          background: linear-gradient(180deg, rgba(192, 218, 255, 0.8) 0%, rgba(13, 42, 56, 0.8) 75%);
        }
      }

      .image-3 {
        background-image: url(${image3});

        .content {
          background: linear-gradient(180deg, rgba(24, 77, 109, 0.8) 0%, rgba(13, 42, 56, 0.8) 70%);
        }
      }

      .image {
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 12px;

        .content {
          display: grid;
          aspect-ratio: 1/1.18;
          box-sizing: border-box;
          padding: 32px;
          align-content: flex-end;
          gap: 16px;
          border-radius: 12px;

          .title {
            color: #fff;
            font-weight: 600;
          }

          .description {
            color: #fff;
            font-weight: 400;
          }
        }
      }
    }
    .create-account {
      justify-self: center;
      width: 327px;
    }
  }
`;
