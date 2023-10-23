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
      <div className='left'>
        <div className='header'>
          <Typography variant='body4'>DAILY NEWS</Typography>
          <div className='buttons'>
            <IconButton size='large'>
              <Icon icon='share' size={20} />
            </IconButton>
            <IconButton size='large'>
              <Icon icon='label-vertical' size={20} />
            </IconButton>
          </div>
        </div>
        <div className='content'>
          <Typography className='title' variant='body3'>Experts predict a dip in property prices</Typography>
          <Typography variant='body4'>
            Experts are saying there’s going to be a decrease in London property prices in the upcoming
            months, and provide information on how you can benefit.
          </Typography>
          <div className='cta'>
            <Label variant='tertiary' size='medium' className='improve-link'>
              Read more
              <Icon icon='arrow-right-1' size={16} />
            </Label>
          </div>
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
      <div className='right'></div>
    </div>
  );
})`
  & {
    display: grid;
    max-width: 1440px;
    grid-template-columns: 1fr 1.06fr;
    margin: 0 auto;
    padding: 88px 36px;
    background: #f3f4f5;
    box-sizing: border-box;

    .left {
      display: grid;
      align-content: space-between;
      background: #fff;
      padding: 64px;
      box-sizing: border-box;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      gap: 88px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

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
        display: grid;
        gap: 24px;

        .title {
          font-family: "At Gambit", serif ;
        }

        .cta {
          display: flex;
          padding: 8px 0px;
          align-items: flex-start;
          gap: 8px;
        }
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
    .right {
      background-image: url(${apartament});
      background-repeat: no-repeat;
      background-size: cover;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      background-position-x: center;
    }
  }
`;
