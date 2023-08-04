import React from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { IRoom } from './messages.interface';
import { Avatar } from '../../components/Avatar';
import { avatars } from '../HomeLoggedIn/avatars';
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

    const avatar = !isNaN(parseInt(row?.participant?.avatar || ''))
      ? avatars[parseInt(row?.participant?.avatar || '')]?.image
      : '';

    console.log('row: ', row, avatar);
    return (
      <div className={`conversation ${className} ${active ? 'active' : ''}`} onClick={() => joinRoom(row)}>
        <div className='match-avatar-intersection'>
          <Avatar image={avatar} />

          {row.unseen_messages > 0 && <span className='unseen-messages-nr'>{row.unseen_messages}</span>}
        </div>

        <div className='details'>
          <Typography variant='body4' className='property'>
            {fullName}
            {/*{row?.last_message?.message ?? ''}*/}
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
    background-color: white;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid white;

    &:hover {
      //background-color: #f7f1e7;
    }

    &.active {
      //background-color: #f7f1e7;
      //border-radius: 12px;
      border: 2px solid #184d6d;
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
        }
      }
    }

    .match-avatar-intersection {
      display: flex;
      position: relative;

      .avatar {
        width: 64px;
        height: 64px;
      }

      .unseen-messages-nr {
        height: 20px;
        width: 20px;
        color: white;
        background-color: #e5155a;
        border-radius: 50%;
        position: absolute;
        z-index: 1;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: 500;
        font-size: 10px;
        line-height: 16px;
        font-family: 'Roobert';
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      row-gap: 8px;

      .property {
        color: #0d2a38;
        font-weight: 700;
      }
    }
  }
`;
