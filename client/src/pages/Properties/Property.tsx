import { styled } from '@mui/system';
import property from '../MyAccount/images/property.png';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import React, { HTMLProps, MouseEventHandler } from 'react';

export interface PropertyProps extends HTMLProps<HTMLDivElement> {
  name: string;
  status: string;
  viewDetails: MouseEventHandler;
  image?: string;
}

export const Property = styled(({ className, name, status, viewDetails, image }: PropertyProps) => {
  return (
    <div className={`property ${className}`}>
      <img className='property-background-image' alt='property-image' src={image || property} />
      <div className='property-footer'>
        <div className='details'>
          <div className={`status status-${status.toLowerCase()}`}>
            <Typography variant='body5'>{status}</Typography>
          </div>
          <Typography className='property-title' variant='body4'>
            {name}
          </Typography>
        </div>
        <Button size='small' variant='secondary' inverted className='details-button' onClick={viewDetails}>
          Edit property
        </Button>
      </div>
    </div>
  );
})`
  &.property {
    border-radius: 16px;
    display: flex;
    aspect-ratio: 1.5 / 1;
    min-height: 292px;
    position: relative;

    .property-background-image {
      position: absolute;
      border-radius: 16px;
      width: 100%;
      aspect-ratio: 1.5 / 1;
    }

    .property-footer {
      background: rgba(38, 38, 38, 0.7);
      backdrop-filter: blur(10px);
      align-self: flex-end;
      width: 100%;
      border-radius: 0 0 16px 16px;
      padding: 16px;
      box-sizing: border-box;
      row-gap: 8px;
      display: grid;
      grid-template-columns: auto min-content;
      justify-content: space-between;
      align-items: center;
      column-gap: 8px;

      .property-title {
        color: white;
        font-weight: 700;
        text-overflow: ellipsis;
      }

      .details {
        display: grid;
        align-items: center;
        row-gap: 8px;

        .status {
          width: min-content;
          border-radius: 8px;
          padding: 4px 8px;
          box-sizing: border-box;
          font-weight: 700;

          background-color: #408140;
          color: white;

          &.status-draft {
            background-color: #cfd5d5;
            color: #646464;
          }

          &.status-live {
            background-color: #408140;
            color: white;
          }
        }
      }
    }
  }
`;
