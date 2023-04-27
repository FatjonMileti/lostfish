import { styled } from '@mui/system';
import React, { HTMLAttributes, useState } from 'react';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';

import { Conversation } from './Conversation';
import { Chatbox } from './Chatbox';

import { ItemList } from '../Chat/components/ItemList';
import { useQuery } from '@tanstack/react-query';
import request from '../../utils/axios';
import { useGlobalState } from '../../globalState';

type Room = any | null;

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    user: [user]
  } = useGlobalState();

  const { userDetails, auth } = user;

  const [room, setRoom] = useState<Room>(null);

  const getMessageList = async () => {
    const response = await request(auth.access_token).get('/api/chat');
    return response.data.docs;
  };

  const { isLoading, isFetching, isFetched, data, refetch } = useQuery(['messages', room], () =>
    getMessageList()
  );

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={`messages-page ${className}`}>
      <div className='chats'>
        <div className='tab-buttons'>
          <Button size='small' className='all-messages'>
            All Messages
          </Button>
          <Button size='small' variant='outlined' className='archived-messages'>
            Archived
          </Button>
        </div>

        <div className='unread'>
          <Typography variant='menu' className='title'>
            UNREAD
          </Typography>
        </div>

        <div className='unread'>
          <Typography variant='menu' className='title'>
            PREVIOUS
          </Typography>

          <div className='conversations-list'>
            {(data || []).map((row: any, rowIndex: number) => {
              const fullName =
                userDetails?.user_id === row.author._id
                  ? `${row.participant.first_name} ${row.participant.last_name}`
                  : `${row.author.first_name} ${row.author.last_name}`;

              return <Conversation joinRoom={() => {}} rows={data} fullName={fullName} row={row} />;
            })}
          </div>

          {/*<ItemList joinRoom={() => {}} rows={data} />*/}
        </div>
      </div>

      <Chatbox />

      <div>{/*<ItemList joinRoom={() => {}} rows={data} />*/}</div>
    </div>
  );
})`
  &.messages-page {
    max-width: 1440px;
    margin-inline: auto;

    background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);

    min-height: 100vh;

    display: grid;
    align-items: flex-end;
    justify-content: center;

    grid-template-columns: 1fr 1.8fr 1fr;
    column-gap: 24px;

    padding: 32px;
    box-sizing: border-box;

    .chats {
      display: flex;
      flex-direction: column;
      row-gap: 32px;
      padding-right: 24px;
      height: 100%;
      border-right: 2px solid #d9d9d9;

      .tab-buttons {
        display: flex;
        column-gap: 8px;
        .button {
          text-transform: none;
        }

        .all-messages {
          background-color: #c0daff;
          color: #0d2a38;
        }

        .archived-messages {
          color: #0d2a38;
          border-color: #c0daff;
          font-weight: 400;
        }
      }

      .unread {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        .title {
          color: #0d2a38;
        }

        .conversations-list {
          display: flex;
          flex-direction: column;
          row-gap: 8px;
        }
      }

      .previous {
        .title {
          color: #0d2a38;
        }
      }
    }
  }
`;
