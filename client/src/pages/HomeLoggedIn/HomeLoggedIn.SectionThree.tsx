import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';
import apartament from './house-inside-ringbox2.png';
import { Label } from '../../components/Label';

export const SectionThree = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='section-wrapper'>
        <div className='left'>
          <div className='section-wrapper'>
            <div className='header'>
              <Typography variant='body4'>DAILY NEWS</Typography>
              <div className='buttons'>
                <IconButton size='large'>
                  <Icon icon='share' size={24} />
                </IconButton>
                <IconButton size='large'>
                  <Icon icon='label-vertical' size={24} />
                </IconButton>
              </div>
            </div>
            <div className='content'>
              <Typography className='first'>Experts predict a dip in property prices</Typography>
              <Typography variant='body4' className='second'>
                Experts are saying there’s going to be a decrease in London property prices in the upcoming
                months, and provide information on how you can benefit.
              </Typography>
              <div className='cta'>
                <Label variant='tertiary' size='medium' className='improve-link'>
                  Read more
                  <Icon icon='arrow-right-1' size={16} />
                </Label>
              </div>
              <div className='buttons'>
                <IconButton size='large'>
                  <Icon icon='chevron-left' size={16} />
                </IconButton>
                <IconButton size='large'>
                  <Icon icon='chevron-right' size={16} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <div className='right'></div>
      </div>
    </div>
  );
})`
  & {
    width: 100%;
    padding: 64px 36px;
    background: #f7f1e7;
    box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.1) inset;
    box-sizing: border-box;

    .section-wrapper {
      width: 100%;
      max-width: 1440px;
      display: grid;
      grid-template-columns: 1fr 1.06fr;
      margin: 0 auto;

      .left {
        display: flex;
        padding: 64px;
        box-sizing: border-box;
        justify-content: center;
        align-items: flex-start;
        gap: 88px;
        background: #fff;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;

        .section-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          flex: 1 0 0;

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;

            .typography {
              color: #c4b1a3;
              font-weight: 600;
            }

            .buttons {
              display: flex;
              align-items: flex-start;
              gap: 16px;

              button {
                background: #fff;
                padding: 20px;
                border: 2px solid #184d6d;

                &:hover {
                  background: #184d6d;
                  color: #fff;
                }
              }
            }
          }

          .content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            align-self: stretch;

            .first {
              font-size: 40px;
              font-weight: 400;
              line-height: 48px;
              width: 70%;
            }
            .second {
              font-weight: 400;
              width: 70%;
            }

            .cta {
              display: flex;
              padding: 8px 0px;
              align-items: flex-start;
              gap: 8px;
            }

            .buttons {
              display: flex;
              align-items: center;
              gap: 8px;

              .icon-button {
                background: #fff;
                border: 2px solid #f3f4f5;
                padding: 14px;
              }

              .icon-button:hover {
                background: #184d6d;
                color: #fff;
              }
            }
          }
        }
      }
      .right {
        background-image: url(${apartament});
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        background-position-x: center;
      }
    }
  }
`;
