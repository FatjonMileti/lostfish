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
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';

import { useUserStore } from '../../globalState/user';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import axios from '../../utils/axios';

import messagesBackground from './massages-page-backgroud.png';
import { Documents } from './Documents/Documents';

registerStore('transactionAgreement', { signed: false });

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const {
    transactionAgreement: [transactionAgreement, setTransactionAgreement]
  } = useGlobalState();

  const userStore = useUserStore();

  const location: Location = useLocation();

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
    handleRoomIdInQueryParams();
  }, []);

  const handleRoomIdInQueryParams = async () => {
    try {
      const userIdInQueryParams = queryParams.get('userId');

      if (userIdInQueryParams && location.state.propertyId) {
        const room =
          (await getRoomWithUser(userIdInQueryParams, location.state.propertyId)) ||
          (await createRoom(userIdInQueryParams, location.state.propertyId));
        if (room) {
          joinRoom(room);
        } else {
          navigate(`/messages`);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const getRoomWithUser = async (userId: string, propertyId: string): Promise<IRoom | false> => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/chat/room', {
        params: { participant: userId, property: propertyId }
      });
      return data;
    } catch (err) {
      return false;
    }
  };

  const createRoom = async (participantId: string, propertyId: string): Promise<IRoom | false> => {
    try {
      const { data } = await axios(userStore.auth.access_token).post('/api/chat/create', {
        author: userStore.userDetails.user_id,
        participant: participantId,
        property: propertyId
      });
      return data;
    } catch (err) {
      return false;
    }
  };

  const previous = useQuery<IRoom[]>(['messages'], async (): Promise<any[]> => {
    const response = await request(userStore.auth.access_token).get('/api/chat');

    setConversations(response.data.docs);
    return response.data.docs;
  });

  const getMessagesForRoom = async (roomId: string) => {
    const response = await request(userStore.auth.access_token).get(
      '/api/chat/' + roomId + '?pageSize=15&page=1'
    );
    setMessages(response.data.docs.reverse());
    previous.refetch();
  };

  const handleReadMessages = async (room: IRoom) => {
    return await request(userStore.auth.access_token).put('/api/chat/read', { room_id: room._id });
  };

  const joinRoom = async (roomObj: IRoom) => {
    try {
      await handleReadMessages(roomObj);
      await getMessagesForRoom(roomObj._id);
      setRoom(roomObj);
      if (socket) socket.emit('join_room', roomObj._id);
    } catch (err) {
      throw err;
    }
  };

  const closeChatBox = () => {
    navigate(`/messages`);
    setRoom(null);
  };

  return (
    <>
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
              <div className='chats-header'>
                <Typography variant='body2'>Your inbox</Typography>
                <Typography variant='body5'>
                  Here you can find all your conversations with your matches or Lostfish representatives
                </Typography>
              </div>

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

            {room ? (
              transactionAgreement.signed || 1 == 1 ? (
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
                    In order to be compliant with our <a>Terms & Conditions</a> you need to sign the
                    transaction agreement. This document allows every party involved to have a transparent and
                    legal view over the entire process. Don’t worry, all your progress will remain saved.
                  </Typography>

                  <Button
                    onClick={() => setTransactionAgreement({ signed: true })}
                    className='go-to-transaction-button'>
                    Go to transaction agreement
                  </Button>
                </div>
              )
            ) : (
              <div />
            )}
            {room ? <Documents /> : <div />}
          </div>
        )}
      </div>
      <BackgroundImage />
    </>
  );
})`
  &.messages-page {
    z-index: 1;
    min-height: 0;
    height: 100vh;
    display: grid;
    box-sizing: border-box;
    grid-template-rows: min-content auto;
    position: relative;

    background: linear-gradient(180deg, rgba(255, 251, 243, 0.99) 18.95%, rgba(255, 255, 255, 0.95) 100%),
      rgba(255, 255, 255, 0.2);

    .no-messages-view {
      display: grid;
      justify-items: center;
      align-content: center;
      padding: 36px;

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
      grid-template-columns: 0.5fr 0.96fr 0.5fr;
      column-gap: 24px;
      overflow-y: auto;
      padding: 24px 36px 36px 36px;
      min-height: calc(100vh - 108px);
      box-sizing: border-box;
    }

    .chats {
      display: flex;
      flex-direction: column;
      row-gap: 24px;
      height: 100%;

      .chats-header {
        display: grid;
        row-gap: 12px;
      }

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

const BackgroundImage = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} />;
})`
  position: fixed;
  inset: 0;

  background: url(${messagesBackground}) center/cover no-repeat;
`;
