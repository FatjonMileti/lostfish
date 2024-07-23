import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Label, Typography } from '../../../../components';
import { useSuggestedProperties } from '../../../Suggestions/SuggestionsProperties/useSuggestedProperties.tsx';
import { useNavigate } from 'react-router-dom';

interface MatchesAwaitingProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesAwaiting = styled(({ className }: MatchesAwaitingProps) => {
  const suggestedProperties = useSuggestedProperties({
    params: {},
    options: {
      refetchOnMount: true
    }
  });

  const navigate = useNavigate();

  return (
    <div className={classNames('matches-awaiting', className)}>
      <div className='left-content'>
        <div className='texts-wrapper'>
          <Typography variant='body1'>Matches are waiting</Typography>
          <Typography variant='body4'>
            Hey John, we’ve found <b>153 potential matches</b> for you that match your requirements. Out of
            those, our algorithms indicate that there could be <b>24 perfect matches for you.</b>
          </Typography>
          <Typography variant='body4'>
            Click the button below to review them or find them in the Matches panel.
          </Typography>
        </div>
        <Label
          className='start-matching-button'
          variant='special'
          size='large'
          onClick={() => navigate('matches')}>
          Review matches
        </Label>
      </div>
      <div className='right-content'>
        <div className='matches-wrapper'>
          {!suggestedProperties.isFetching &&
            suggestedProperties?.data.slice(0, 5).map((sp, spIndex) => {
              return <img key={spIndex} alt='Matched property' src={sp.property.property_images[0].link} />;
            })}
        </div>
      </div>
    </div>
  );
})`
  &.matches-awaiting {
    display: flex;
    width: 904px;
    align-items: flex-start;
    gap: 24px;
    flex-shrink: 0;

    border-radius: 16px;
    background: #fff;
    /* Shadow L */
    box-shadow: 0px 4px 32px 0px rgba(13, 42, 56, 0.1);

    .left-content {
      display: flex;
      padding: 48px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 24px;
      flex: 1 0 0;
      align-self: stretch;

      .start-matching-button {
        width: 100%;
      }

      .texts-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        align-self: stretch;
      }
    }

    .right-content {
      display: flex;
      padding: 24px;
      align-items: flex-start;
      gap: 10px;

      .matches-wrapper {
        width: 392px;
        height: 392px;
        position: relative;

        img {
          flex-shrink: 0;
          position: absolute;

          &:nth-of-type(1) {
            height: 124px;
            aspect-ratio: 1.5/1;
            top: 42px;
            right: 12px;
            border-radius: 6px;
          }

          &:nth-of-type(2) {
            border-radius: 7px;
            aspect-ratio: 1.5/1;
            height: 165px;
            top: 131px;
            right: 60px;
          }

          &:nth-of-type(3) {
            border-radius: 7px;
            aspect-ratio: 1.5/1;
            height: 80px;
            left: 31px;
            bottom: 80px;
          }

          &:nth-of-type(4) {
            border-radius: 5px;
            aspect-ratio: 1.5/1;
            height: 90px;
            right: 36px;
            bottom: 54px;
          }

          &:nth-of-type(5) {
            border-radius: 6px;
            aspect-ratio: 1.5/1;
            height: 116px;
            top: 68px;
            right: 241px;
          }
        }
      }
    }
  }
`;
