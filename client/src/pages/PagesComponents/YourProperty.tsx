import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

interface YourPropertyProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  editProperty?: () => void;
  image: string;
  address: string;
  price: string;
}

export const YourProperty = styled(
  ({ className, title, address, price, editProperty }: YourPropertyProps) => {
    return (
      <div className={classNames(className, 'your-property')}>
        <div className='property-footer'>
          <Typography className='property-title' variant='body4'>
            {title}
          </Typography>
          <div className='details'>
            <div className='match-percentage'>
              <div className='detail'>
                <Icon icon='location' />
                <Typography variant='body5'>{address}</Typography>
              </div>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>£{price} PCM</Typography>
              </div>
            </div>
            <Button
              size='small'
              variant='secondary'
              inverted
              className='details-button'
              onClick={editProperty}>
              Edit property
            </Button>
          </div>
        </div>
      </div>
    );
  }
)`
  &.your-property {
    background-image: url('${(props) => props.image}');
    border-radius: 12px;
    display: flex;
    aspect-ratio: 1.34 / 1;
    background-repeat: no-repeat;
    background-size: cover;

    .property-footer {
      background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.8) 43.75%);
      align-self: flex-end;
      width: 100%;
      border-radius: 0 0 12px 12px;
      padding: 16px;
      box-sizing: border-box;
      row-gap: 8px;
      display: flex;
      flex-direction: column;

      .property-title {
        color: white;
        font-weight: 700;
      }

      .details {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .match-percentage {
          color: white;
          font-weight: 700;
          display: flex;
          column-gap: 24px;
          align-items: center;

          .detail {
            display: flex;
            column-gap: 4px;
            align-items: center;
          }
        }
        .details-button {
          padding: 12px 20px;
          font-size: 14px;
          line-height: 20px;
          flex-shrink: 0;
        }
      }
    }
  }
`;
