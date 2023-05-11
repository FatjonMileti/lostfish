import React from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';

import propertyMatchThumbnail from './propertyMatchThumbnail.png';
import { IRoom } from './messages.interface';
export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const Conversation = styled(
  (props: {
    joinRoom: (roomId: IRoom) => void;
    fullName: string;
    row: any;
    className?: string;
    active?: boolean;
  }) => {
    const { joinRoom, fullName, row, className, active } = props;

    return (
      <div className={`conversation ${className} ${active ? 'active' : ''}`} onClick={() => joinRoom(row)}>
        <div className='match-avatar-intersection'>
          <div className='avatar' style={{ backgroundColor: stringToColor(fullName) }}>
            {fullName.split(' ')[0][0]}
            {fullName.split(' ')[1][0]}
          </div>

          <img className='match-thumbnail' src={propertyMatchThumbnail} alt='match thumbnail' />
          {row.unseen_messages ? row.unseen_messages : ''}
        </div>

        <div className='details'>
          <Typography variant='body4' className='property'>
            {row?.last_message?.message ?? ''}
          </Typography>
          <Typography variant='body6'>Matched on February 27th 2023</Typography>
        </div>
      </div>
    );
  }
)`
  &.conversation {
    display: flex;
    column-gap: 10px;
    padding: 16px;
    align-items: center;
    box-sizing: border-box;

    &:hover {
      cursor: pointer;
      border-radius: 12px;
      background-color: #f7f1e7;
    }

    &.active {
      background-color: #f7f1e7;
      border-radius: 12px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Roobert;
      font-size: 14px;
      font-weight: 500;
    }

    &.active {
      .match-avatar-intersection {
        .avatar {
          :after {
            background-color: #f7f1e7;
          }
        }
      }
    }

    .match-avatar-intersection {
      display: flex;

      .avatar {
        position: relative;
        margin-right: -13px;
        overflow: hidden;
        :after {
          background-color: #ffffff;
          clip-path: circle(50%);
          width: 100%;
          height: 100%;
          content: '';
          position: absolute;
          left: calc(100% - 13px);
        }
      }

      .match-thumbnail {
        border-radius: 50%;
        height: 48px;
        width: 48px;
      }
    }

    .details {
      display: flex;
      flex-direction: column;

      .property {
        color: #0d2a38;
        font-weight: 700;
      }
    }
  }
`;
