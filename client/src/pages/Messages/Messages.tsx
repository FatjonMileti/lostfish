import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { Conversation } from './Conversation';
import { Chatbox } from './Chatbox';
import { Header } from '../HomeLoggedIn/Header';
import { useQuery } from '@tanstack/react-query';
import request from '../../utils/axios';
import { useGlobalState, registerStore } from '../../globalState/globalState';
import SocketContext from '../../context/SocketContext';
import { IMessageItem, IRoom } from './messages.interface';

import noMessages from './noMessages.png';
import { Footer } from '../Home/Footer';
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';

import { useUserStore } from '../../globalState/user';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

registerStore('transactionAgreement', { signed: false });

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    transactionAgreement: [transactionAgreement, setTransactionAgreement]
  } = useGlobalState();

  const userStore = useUserStore();

  const { socket } = useContext(SocketContext);

  const [room, setRoom] = useState<IRoom | null>(null);
  const [messages, setMessages] = useState<IMessageItem[]>([]);
  const [conversations, setConversations] = useState<IRoom[]>([]);

  const queryParams = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  const reorderMessages = (data: any) => {
    const filteredRooms = conversations.filter((room: IRoom) => room._id.toString() !== data._id.toString());
    setConversations([data, ...filteredRooms]);
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

  React.useEffect(() => {
    const userIdInQueryParams = queryParams.get('userId');

    if (!room && userIdInQueryParams) {
      console.log('userIdInQueryParams: ', userIdInQueryParams);
      console.log('conversations: ', conversations);
      if (conversations.length > 0) {
        const roomOnQueryParameter = conversations.find((c) => c.participant._id === userIdInQueryParams);
        if (roomOnQueryParameter) {
          joinRoom(roomOnQueryParameter);
        } else {
          createRoom(userIdInQueryParams).then(async () => {
            await previous.refetch();
          });
        }
      }
    }
  }, [conversations]);

  const createRoom = async (participantId: string) => {
    try {
      const { data } = await axios(userStore.auth.access_token).post('/api/chat/create', {
        author: userStore.userDetails.user_id,
        participant: participantId
      });
    } catch (err) {}
  };

  const previous = useQuery<IRoom[]>(['messages'], async (): Promise<any[]> => {
    const response = await request(userStore.auth.access_token).get('/api/chat');

    setConversations(response.data.docs);
    return response.data.docs;
  });

  const getMessagesForRoom = async (roomId: string) => {
    const response = await request(userStore.auth.access_token).get(
      '/api/chat/' + roomId + '?pageSize=10&page=1'
    );
    setMessages(response.data.docs.reverse());
    previous.refetch();
  };

  const handleReadMessages = async (room: IRoom) => {
    return await request(userStore.auth.access_token).put('/api/chat/read', { room_id: room._id });
  };

  const joinRoom = async (roomObj?: IRoom | null) => {
    if (userStore.userDetails && roomObj) {
      await handleReadMessages(roomObj);
      await getMessagesForRoom(roomObj._id);
      setRoom(roomObj);
      if (socket) socket.emit('join_room', roomObj._id);
      navigate(`/messages?userId=${roomObj.participant._id}`);
    }
  };

  const closeChatBox = () => {
    navigate(`/messages`);
    setRoom(null);
  };

  return (
    <div
      className={`messages-page ${
        !previous.isLoading && previous.data?.length === 0 ? 'no-messages' : ''
      } ${className}`}>
      <Header />
      <Backdrop open={previous.isLoading || previous.isFetching}></Backdrop>

      {!previous.isLoading && previous.data?.length === 0 && (
        <div className='no-messages-view'>
          <img src={noMessages} alt='no messages' />
          <Typography variant='body2' className='title'>
            You don’t have any messages at the moment.
          </Typography>
          <Typography variant='body5' className='description'>
            Once you perfectly match with someone, you can start a conversation and it will appear here.
          </Typography>
        </div>
      )}

      {previous.isLoading && <div />}

      {!previous.isLoading && previous.data?.length !== 0 && (
        <div className='container'>
          <div className='chats'>
            <Typography variant='body2'>My messages</Typography>

            <div className='conversations-list'>
              {conversations.map((row: IRoom, rowIndex: number) => {
                const fullName =
                  userStore.userDetails?.user_id === row?.author?._id
                    ? `${row.participant?.first_name} ${row.participant?.last_name}`
                    : `${row.author?.first_name} ${row.author?.last_name}`;

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
            </div>
          </div>

          <div className='line'></div>

          {room &&
            (transactionAgreement.signed || 1 == 1 ? (
              <Chatbox
                username={userStore.userDetails?.username}
                room={room}
                user_id={userStore.userDetails?.user_id}
                messages={messages}
                socket={socket}
                closeDeal={closeChatBox}
                updateList={reorderMessages}
              />
            ) : (
              <div className='transaction-agreement'>
                <Typography variant='body2' className='transaction-title'>
                  Sign the transaction agreement to view the conversation
                </Typography>

                <Typography className='transaction-description' variant='body4'>
                  In order to be compliant with our <a>Terms & Conditions</a> you need to sign the transaction
                  agreement. This document allows every party involved to have a transparent and legal view
                  over the entire process. Don’t worry, all your progress will remain saved.
                </Typography>

                <Button
                  onClick={() => setTransactionAgreement({ signed: true })}
                  className='go-to-transaction-button'>
                  Go to transaction agreement
                </Button>
              </div>
            ))}
        </div>
      )}

      <Footer />
    </div>
  );
})`
  &.messages-page {
    min-height: 0;
    height: 100vh;
    display: grid;
    box-sizing: border-box;
    grid-template-rows: min-content auto min-content;
    background: #ffffff;

    .no-messages-view {
      display: grid;
      justify-items: center;
      align-content: center;

      img {
        max-height: 280px;
      }

      .title {
        margin-top: 24px;
      }

      .description {
        margin-top: 16px;
        max-width: 440px;
        text-align: center;
      }
    }

    .container {
      display: grid;
      grid-template-columns: 1fr min-content 2.8fr;
      column-gap: 69px;
      overflow-y: auto;
      padding: 44px 36px;
      min-height: calc(100vh - 108px);
      box-sizing: border-box;

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

    .transaction-agreement {
      display: grid;
      justify-items: center;
      background-color: #e7e7e7;
      border-radius: 16px;
      align-content: center;

      .transaction-title {
        max-width: 440px;
        text-align: center;
      }

      .transaction-description {
        margin-top: 16px;
        max-width: 440px;
        text-align: center;
      }

      .go-to-transaction-button {
        margin-top: 28px;
      }
    }
  }
`;
