import React from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { IRoom } from './messages.interface';
import { Avatar } from '../../components/Avatar';
import { getAvatarFormIndex } from '../HomeLoggedIn/avatars';
import moment from 'moment';
import { useUserStore } from '../../globalState/user';
import classNames from 'classnames';

export const Conversation = styled(
  (props: {
    joinRoom: (roomId: IRoom) => void;
    fullName: string;
    room: IRoom;
    className?: string;
    active?: boolean;
  }) => {
    const { joinRoom, fullName, room: room, className, active } = props;

    const userStore = useUserStore();

    const avatarKey =
      userStore.userDetails?.user_id === room?.author?._id ? room?.participant?.avatar : room?.author?.avatar;

    const avatar = getAvatarFormIndex(avatarKey);

    return (
      <div className={`conversation ${className} ${active ? 'active' : ''}`} onClick={() => joinRoom(room)}>
        <div className='avatar-and-unseen-messages-wrapper'>
          <Avatar
            image={avatar}
            className={classNames({
              lostfish: avatarKey === 'lostfish'
            })}
          />

          {room.unseen_messages !== undefined && room.unseen_messages > 0 && (
            <span className='unseen-messages-nr'>{room.unseen_messages}</span>
          )}
        </div>

        <div className='details'>
          <Typography variant='body4' className='property'>
            {fullName}
          </Typography>
          <Typography variant='body6'>
            {room.last_message?.created_at &&
              moment(room.last_message.created_at).format('dddd, MMMM Do YYYY')}
          </Typography>
        </div>
      </div>
    );
  }
)`
  &.conversation {
    display: flex;
    column-gap: 16px;
    padding: 16px;
    align-items: center;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid white;

    &.active {
      border: 2px solid #c4b1a3;
    }

    .avatar-and-unseen-messages-wrapper {
      display: flex;
      position: relative;

      .avatar {
        width: 48px;
        height: 48px;
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
