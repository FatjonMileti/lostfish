import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';
import apartament from './image353.png';
import { Avatar } from '../../components/Avatar';
import { avatars } from '../HomeLoggedIn/avatars';
import { Button } from '../../components/Button';

export const SectionTwo = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='section-wrapper'>
        <div className='left'>
          <div className='img'>
            <div className='top'>
              <div className='left-part'>
                <Typography className='property-name'>Two bedroom apartment for rent</Typography>
                <div className='property-details'>
                  <div className='detail'>
                    <Icon icon='location' />
                    <Typography variant='body5'>Bristol, UK</Typography>
                  </div>
                  <Typography variant='body4' className='dot'>
                    •
                  </Typography>
                  <div className='detail'>
                    <Icon icon='banknote' />
                    <Typography variant='body5'>£1,150 PCM</Typography>
                  </div>
                  <Typography variant='body4' className='dot'>
                    •
                  </Typography>
                  <div className='detail'>
                    <Icon icon='double-bed' />
                    <Typography variant='body5'>2</Typography>
                  </div>
                  <Typography variant='body4' className='dot'>
                    •
                  </Typography>
                  <div className='detail'>
                    <Icon icon='bathtub' />
                    <Typography variant='body5'>1</Typography>
                  </div>
                </div>
              </div>
              <div className='potential-matches-list'>
                <Avatar image={avatars[0].image} />
                <Avatar image={avatars[1].image} />
                <Avatar image={avatars[2].image} />
                <div className='others-number'>
                  <Typography variant='body4'>+49</Typography>
                </div>
              </div>
            </div>
            <div className='bottom'>
              <Button active={true} inverted size='large'>
                View matches
              </Button>
              <Button active={false} inverted size='large'>
                Edit property
              </Button>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='views'>
            <div className='label'>
              <Icon icon='eye' size={24} />
              <Typography variant='body5' className='title'>
                Property views
              </Typography>
            </div>
            <div className='section-content'>
              <div className='total-viewes'>
                <Typography className='number'>14,528</Typography>
                <div className='text'>
                  <Typography variant='body4'>Total views</Typography>
                </div>
              </div>
              <IconButton size='large'>
                <Icon icon='chevron-right' size={16} />
              </IconButton>
            </div>
          </div>
          <div className='views'>
            <div className='label'>
              <Icon icon='dashboard' size={24} />
              <Typography variant='body5' className='title'>
                Property score
              </Typography>
            </div>
            <div className='section-content'>
              <div className='total-viewes'>
                <Typography className='number'>75/100</Typography>
                <div className='text'>
                  <Typography variant='body4'>Add more details</Typography>
                </div>
              </div>
              <IconButton size='large'>
                <Icon icon='chevron-right' size={16} />
              </IconButton>
            </div>
          </div>
          <div className='views'>
            <div className='label'>
              <Icon icon='exclude' size={24} />
              <Typography variant='body5' className='title'>
                Matching
              </Typography>
            </div>
            <div className='section-content'>
              <div className='total-viewes'>
                <Typography className='number'>53</Typography>
                <div className='text'>
                  <Typography variant='body4'>Potential perfect matches</Typography>
                </div>
              </div>
              <IconButton size='large'>
                <Icon icon='chevron-right' size={16} />
              </IconButton>
            </div>
          </div>
          <div className='views'>
            <div className='label'>
              <Icon icon='star' size={24} />
              <Typography variant='body5' className='title'>
                Added to favourites
              </Typography>
            </div>
            <div className='section-content'>
              <div className='total-viewes'>
                <Typography className='number'>21</Typography>
                <div className='text'>
                  <Typography variant='body4'>Liked your property</Typography>
                </div>
              </div>
              <IconButton size='large'>
                <Icon icon='chevron-right' size={16} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})`
  & {
    width: 100%;

    padding: 64px 36px;
    background: #fff;
    box-sizing: border-box;

    .section-wrapper {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      display: grid;
      column-gap: 24px;
      grid-template-columns: 1fr 1fr;

      .left {
        flex-shrink: 0;

        border-radius: 12px;
        background-image: url(${apartament});
        background-repeat: no-repeat;
        background-size: cover;

        box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);

        display: grid;
        align-content: space-between;
        overflow: hidden;

        .img {
          display: grid;
          align-content: space-between;
          width: 100%;
          height: 452px;

          .top {
            display: flex;
            padding: 24px;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;
            background: linear-gradient(180deg, rgba(38, 38, 38, 0.7) 0%, rgba(38, 38, 38, 0) 100%);

            .left-part {
              display: grid;
              row-gap: 16px;
              .property-name {
                font-family: Roobert, serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                color: white;
              }

              .property-details {
                color: white;
                font-weight: 700;
                display: flex;
                column-gap: 8px;
                align-items: center;

                .detail {
                  display: flex;
                  column-gap: 4px;
                  align-items: center;
                }
                .dot {
                  color: #a7a7a7;
                }
              }
            }

            .potential-matches-list {
              display: flex;

              .avatar {
                height: 64px;
                width: 64px;
                margin-left: -8px;
                z-index: 1;

                &:first-of-type {
                  margin-left: 0;
                }
              }

              .others-number {
                height: 64px;
                width: 64px;
                border-radius: 50%;
                background-color: #f7f1e7;
                color: #0d2a38;
                font-weight: 700;
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;
                margin-left: -8px;
              }
            }
          }

          .bottom {
            display: flex;
            width: 100%;
            padding: 24px;
            align-items: center;
            gap: 24px;
            background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 43.75%);
            box-sizing: border-box;

            button {
              color: #fff;
              background: none;
              border: 2px solid #fff;
              border-radius: 250px;
              font-family: Roobert;
              font-size: 18px;
              font-weight: 600;

              &:hover {
                background: #fff;
                color: #0d2a38;
              }
            }

            .active {
              background: #fff;
              color: #0d2a38;
            }
          }
        }
      }

      .right {
        display: grid;
        gap: 24px;
        grid-template-columns: 1fr 1fr;

        .views {
          display: flex;
          padding: 24px;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          box-sizing: border-box;

          border-radius: 12px;
          background: linear-gradient(135deg, #fcf9f5 0%, #fbf8f3 100%);

          .label {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #a7a7a7;

            .title {
              font-weight: 600;
              line-height: 16px;
            }
          }
        }

        .section-content {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          align-self: stretch;

          .total-viewes {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            flex: 1 0 0;

            .number {
              color: #0d2a38;
              text-align: center;
              font-family: Roobert;
              font-size: 48px;
              font-style: normal;
              font-weight: 700;
              line-height: 64px;
            }

            .text {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              align-self: stretch;

              .typography {
                color: #0d2a38;
                font-size: 14px;
                font-weight: 700;
              }
            }
          }

          button {
            background: #fff;
            padding: 16px;

            &:hover {
              background: #0d2a38;
              color: #fff;
            }
          }
        }
      }
    }
  }
`;
