import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';

export const SectionOne = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='section-content'>
        <div className='welcome'>
          <Typography className='perfect-match'>
            Finding the <span className='perfect-match-red'>perfect match</span> between landlords and tenants
          </Typography>
          <Typography variant='body4' className='texts'>
            We use the power of AI to find landlords and tenants exactly what they are looking for.
            <br />
            The perfect match for their home or the perfect home for their match.
          </Typography>
        </div>

        <div className='refine-search'>
          <div className='looking-for'>
            <Icon icon='search' size={32} />
            <Typography variant='body4' className='looking-for-text'>
              What are you looking for?
            </Typography>
          </div>
          <Button variant='primary' size='large' className='start-matching'>
            Start matching
          </Button>
        </div>
      </div>
      <div className='bottom'>
        <Typography variant='body4'>Keen to find out how we’re doing it? </Typography>
        <div className='cta'>
          <Label
            variant='tertiary'
            size='small'
            className='improve-link'
            onClick={() =>
              window.scrollTo({
                top: 900,
                behavior: 'smooth'
              })
            }>
            Scroll down
            <Icon icon='arrow-right-1' size={16} />
          </Label>
        </div>
      </div>
    </div>
  );
})`
  & {
    width: 100%;
    height: calc(100vh - 112px);
    display: grid;
    padding: 176px 36px 64px 36px;
    justify-content: center;
    align-content: space-between;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    .section-content {
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

      .welcome {
        width: 904px;
        display: grid;
        align-items: center;
        gap: 24px;

        .perfect-match {
          text-align: center;
          font-size: 56px;
          font-weight: 400;
          line-height: 64px;

          .perfect-match-red {
            color: #e5155a;
          }
        }

        .texts {
          text-align: center;
          font-weight: 400;
        }
      }

      .refine-search {
        width: max-content;
        display: flex;
        padding: 12px 12px 12px 24px;
        box-sizing: border-box;
        align-items: center;
        margin: 0 auto;
        gap: 64px;
        background-color: #fff;
        border-radius: 25000px;

        .looking-for {
          display: flex;
          align-items: center;
          gap: 8px;

          .looking-for-text {
            color: #0d2a38;
            font-size: 18px;
            font-weight: 700;
          }
        }

        .start-matching {
          background-color: #e5155a;
          border: 1px solid #b4263b;
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;

      .cta {
        display: flex;

        .improve-link {
          font-size: 16px;
          line-height: 24px;

          .icon {
            rotate: 90deg;
          }
        }
      }
    }
  }
`;
