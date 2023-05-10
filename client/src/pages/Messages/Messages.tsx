import React, { HTMLAttributes, useEffect, useState, useContext } from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { Conversation } from './Conversation';
import { Chatbox } from './Chatbox';
import { Header } from '../HomeLoggedIn/Header';
import { useQuery } from '@tanstack/react-query';
import request from '../../utils/axios';
import { useGlobalState } from '../../globalState';
import SocketContext from '../../context/SocketContext';
import { Skeleton } from '@mui/lab';

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    user: [{ userDetails, auth }]
  } = useGlobalState();

  const { socket } = useContext(SocketContext);

  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [conversations, setConversations] = useState<any>([]);

  const reorderMessages = (data: any) => {
    const filteredMesages = conversations.filter(
      (message: any) => message._id.toString() !== data._id.toString()
    );
    setConversations([data, ...filteredMesages]);
  };

  // @ts-ignore
  useEffect(() => {
    if (socket) {
      socket.on('update_message_list', reorderMessages);

      return () => {
        socket.off('update_message_list');
      };
    }
  }, [reorderMessages]);

  const previous = useQuery<any[]>(['messages'], async (): Promise<any[]> => {
    const response = await request(auth.access_token).get('/api/chat');

    return await new Promise((resolve) =>
      setTimeout(() => {
        setConversations(response.data.docs);
        resolve(response.data.docs);
      }, 300)
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
      if (socket) return socket.emit('join_room', roomObj._id);
    }
  };

  return (
    <div className={`messages-page ${className}`}>
      <Header />
      <div className='container'>
        <div className='chats'>
          <Typography variant='body2'>My messages</Typography>

          <div className='conversations-list'>
            {(conversations || []).map((row: any, rowIndex: number) => {
              const fullName =
                userDetails?.user_id === row?.author?._id
                  ? `${row.participant.first_name} ${row.participant.last_name}`
                  : `${row.author.first_name} ${row.author.last_name}`;

              return (
                <Conversation
                  key={rowIndex}
                  joinRoom={joinRoom}
                  fullName={fullName}
                  row={row}
                  active={room?._id === row?._id}
                />
              );
            })}

            {previous.isLoading &&
              [1, 2].map((i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'min-content auto',
                      alignItems: 'center',
                      columnGap: '10px',
                      padding: '16px'
                    }}>
                    <div style={{ display: 'flex' }}>
                      <Skeleton variant='circular' width={48} height={48} />
                      <Skeleton variant='circular' width={48} height={48} style={{ marginLeft: '-15px' }} />
                    </div>
                    <div>
                      <Skeleton height={20} width={200} />
                      <Skeleton height={10} width={230} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className='line'></div>

        {room && (
          <Chatbox
            username={userDetails?.username}
            room={room}
            user_id={userDetails?.user_id}
            messages={messages}
            socket={socket}
            closeDeal={() => setRoom(null)}
            updateList={reorderMessages}
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

    background: #ffffff;

    .container {
      display: grid;
      grid-template-columns: 1fr min-content 2.8fr;
      column-gap: 69px;
      overflow-y: auto;
      padding: 44px 36px;

      .line {
        width: 2px;
        background: #f3f4f5;
      }
    }

    .chats {
      display: flex;
      flex-direction: column;
      row-gap: 24px;
      height: 100%;

      .conversations-list {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
      }
    }
  }
`;
