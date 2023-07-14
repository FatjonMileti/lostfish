import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import { Icon } from '../../components/Icon';
import illustration1 from './illustration1.png';

export const NoWaitingSection = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='left'>
        <div className='description-part'>
          <div className='texts'>
            <Typography>No waiting, no chasing, no middlemen.</Typography>
            <Typography variant='body4'>
              Our goal is to increase transparency and trust in the process to achieve the best results for
              customers in a quick, calm, and informed manner.
            </Typography>
          </div>

          <Button size='large'>Find out more</Button>
        </div>
        <div className='illustration-part'></div>
      </div>
      <div className='right'>
        <div className='card matches-card'>
          <Typography variant='body3' className='title'>
            Current search
          </Typography>
          <Typography variant='body3' className='number nr-matches'>
            528
          </Typography>
          <div className='footer-section'>
            <Typography variant='body5' className='subtitle'>
              Potential matches
            </Typography>
            <Label variant='tertiary' size='small'>
              Refine
              <Icon icon='arrow-right-1' size='16' />
            </Label>
          </div>
        </div>
        <div className='card starred-matches-card'>
          <Typography variant='body3' className='title'>
            Starred matches
          </Typography>
          <Typography variant='body3' className='number nr-starred-matches'>
            64
          </Typography>
          <div className='footer-section'>
            <Typography variant='body5' className='subtitle'>
              Saved matches
            </Typography>
            <Label variant='tertiary' size='small'>
              Review
              <Icon icon='arrow-right-1' size='16' />
            </Label>
          </div>
        </div>
        <div className='card trust-score-card'>
          <Typography variant='body3' className='title'>
            Trust score
          </Typography>
          <Typography variant='body3' className='number trust-score'>
            60%
          </Typography>

          <div className='footer-section'>
            <Typography variant='body5' className='subtitle'>
              Current score
            </Typography>
            <Label variant='tertiary' size='small'>
              improve
              <Icon icon='arrow-right-1' size='16' />
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
})`
  & {
    display: grid;
    column-gap: 24px;
    grid-template-columns: 4fr 1fr;

    .left {
      border-radius: 12px;
      background: var(--monochrome-pure-white, #fff);
      box-shadow: 0px -24px 48px 0px rgba(0, 0, 0, 0.02);

      display: grid;

      grid-template-columns: auto min-content;

      .description-part {
        padding: 36px;
        display: grid;
        align-content: center;
        row-gap: 48px;

        .texts {
          display: grid;
          row-gap: 16px;
        }
      }

      .illustration-part {
        width: 556px;
        background-image: url(${illustration1});
        background-repeat: no-repeat;
        background-position: center;
      }
      }
    }

    .right {
      display: grid;
      row-gap: 24px;
      .card {
        border-radius: 12px;
        padding: 24px;
        box-sizing: border-box;
        width: 324px;

        &.matches-card {
          background: linear-gradient(135deg, #e6f0ff 0%, #d3e5ff 100%);
          .number {
            color: #0d2a38;
          }
          .subtitle {
            color: #0d2a38;
          }
        }
        &.starred-matches-card {
          background: linear-gradient(135deg, #fbf8f3 0%, #f7f1e7 100%);
          .number {
            color: #c4b1a3;
          }
          .subtitle {
            color: #c4b1a3;
          }
        }
        &.trust-score-card {
          background: linear-gradient(135deg, #f9fafa 0%, #f3f4f5 100%);
          .number {
            color: #e5155a;
          }
          .subtitle {
            color: #e5155a;
          }
        }

        .title {
          font-family: At Gambit,serif;
        }

        .number {
          margin-top: 16px;
          font-size: 48px;
          font-weight: 700;
          line-height: 64px;
        }

        .subtitle {
          font-weight: 700;
        }

        .footer-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          column-gap: 24px;
        }
      }
    }
  }
`;
