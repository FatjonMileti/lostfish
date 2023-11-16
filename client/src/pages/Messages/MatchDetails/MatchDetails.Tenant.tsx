import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { IRoom } from '../messages.interface';
import classNames from 'classnames';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';
import moment from 'moment/moment';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { useUserStore } from '../../../globalState/user';

interface MatchDetailsTenantProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
}

export const MatchDetailsTenant = styled(({ className, room }: MatchDetailsTenantProps) => {
  const userStore = useUserStore();

  const avatarKey =
    userStore.userDetails?.user_id === room?.author?._id ? room?.participant?.avatar : room?.author?.avatar;

  const avatar = getAvatarFormIndex(avatarKey);

  const fullName =
    userStore.userDetails?.user_id === room?.author?._id
      ? `${room.participant?.first_name} ${room.participant?.last_name}`
      : `${room.author?.first_name} ${room.author?.last_name}`;

  return (
    <div className={classNames('match-details-tenant', className)}>
      <div className={`tenant-details ${className}`}>
        <Avatar image={avatar} />

        <div className='details'>
          <Typography variant='body4' className='name'>
            {fullName}
          </Typography>
          <Typography variant='body6' className='matched-date'>
            {'Matched on '}
            {room.tenant_match?.created_at && moment(room.tenant_match.created_at).format('MMMM Do YYYY')}
          </Typography>
        </div>
      </div>

      <Label variant='secondary' className='view-profile-button'>
        View profile
      </Label>

      <div className='explanation'>
        <Typography variant='body6' className='explanation-title'>
          Offers
        </Typography>
        <Typography variant='body6' className='explanation-description'>
          Any offers that this tenant sends you will appear here. You can{' '}
          <span className='bold'>Accept, Reject</span> or
          <span className='bold'> Reject and unmatch</span>
        </Typography>
      </div>

      <div className='divider' />

      <div className='explanation'>
        <Typography variant='body6' className='explanation-title'>
          Connection
        </Typography>
        <Typography variant='body6' className='explanation-dsecription'>
          In order to complete the transaction, you will need to provide us with some documents. Once you have
          all the documents uploaded you can complete the transaction.
        </Typography>
      </div>

      <div className='action-buttons'>
        <Label special variant='secondary'>
          <Icon icon='dislike' size={24} />
          Unmatch
        </Label>
        <Label variant='secondary'>
          <Icon icon='email' />
          Report
        </Label>
      </div>
    </div>
  );
})`
  &.match-details-tenant {
    border-radius: 12px;
    background: #f7f1e7;
    box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.12);

    padding: 24px;
    display: grid;
    row-gap: 24px;
    align-self: flex-start;

    .tenant-details {
      display: flex;
      column-gap: 8px;

      .details {
        display: flex;
        flex-direction: column;
        row-gap: 8px;

        .name {
          color: #0d2a38;
          font-weight: 700;
        }

        .matched-date {
          color: #a7a7a7;
        }
      }
    }

    .view-profile-button {
      width: 100%;
    }

    .explanation {
      display: grid;
      row-gap: 4px;
      .explanation-title {
        font-weight: 700;
      }

      .explanation-description {
        .bold {
          font-weight: 600;
        }
      }
    }

    .divider {
      background: #e7e7e7;
      height: 2px;
    }

    .action-buttons {
      display: flex;
      column-gap: 16px;

      .label {
        flex-grow: 1;
      }
    }
  }
`;
