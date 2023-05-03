import React, { HTMLAttributes, useState } from 'react';
import { styled } from '@mui/system';

import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Conversation } from './Conversation';
import { Chatbox } from './Chatbox';
import { Header } from '../HomeLoggedIn/Header';

import { useQuery } from '@tanstack/react-query';
import request from '../../utils/axios';
import { useGlobalState } from '../../globalState';

import socket from '../../context/socket';
import { Skeleton } from '@mui/lab';

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    user: [{ userDetails, auth }]
  } = useGlobalState();

  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);

  const previous = useQuery<any[]>(['messages'], async (): Promise<any[]> => {
    const response = await request(auth.access_token).get('/api/chat');

    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(response.data.docs);
      }, 1000)
    );
  });

  const getMessagesForRoom = async (roomId: string) => {
    const response = await request(auth.access_token).get('/api/chat/' + roomId + '?pageSize=10&page=1');
    setMessages(response.data.docs.reverse());
  };

  const joinRoom = async (roomObj?: any | null) => {
    if (userDetails?.username && roomObj) {
      await getMessagesForRoom(roomObj._id);
      setRoom(roomObj);
      return socket.emit('join_room', roomObj._id);
    }
  };

  return (
    <div className={`messages-page ${className}`}>
      <Header />
      <div className='container'>
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

          <div className='previous'>
            <Typography variant='menu' className='title'>
              PREVIOUS
            </Typography>

            <div className='conversations-list'>
              {(previous?.data || []).map((row: any, rowIndex: number) => {
                const fullName =
                  userDetails?.user_id === row.author._id
                    ? `${row.participant.first_name} ${row.participant.last_name}`
                    : `${row.author.first_name} ${row.author.last_name}`;

                return <Conversation key={rowIndex} joinRoom={joinRoom} fullName={fullName} row={row} />;
              })}

              {previous.isLoading &&
                [1, 2].map(() => {
                  return (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'min-content auto',
                        alignItems: 'center',
                        columnGap: '10px',
                        padding: '16px'
                      }}>
                      <Skeleton variant='circular' width={32} height={32} />
                      <Skeleton height={20} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {room && (
          <Chatbox
            username={userDetails?.username}
            room={room}
            user_id={userDetails?.user_id}
            messages={messages}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
})`
  &.messages-page {
    min-height: 0;
    height: 100vh;
    display: grid;
    box-sizing: border-box;
    grid-template-rows: min-content auto;

    background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 24px;
      overflow-y: auto;
      padding: 44px 36px;
    }

    .chats {
      display: flex;
      flex-direction: column;
      row-gap: 32px;
      height: 100%;

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
    }
  }
`;
