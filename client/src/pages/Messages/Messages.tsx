import React, { HTMLAttributes } from 'react';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Typography } from '../../components/Typography';
import { ShowGlobalLoading } from '../../components/ShowGlobalLoading';
import { Button } from '../../components/Button';

import { Conversation } from './Conversation';
import { ChatBox } from './ChatBox/ChatBox';
import { Header } from '../HomeLoggedIn/Header';
import { DocumentsTest } from './Documents/DocumentsTest';
import { MessagesProperties } from './Messages.Properties';

import axios from '../../utils/axios';

import SocketContext from '../../context/SocketContext';
import { useUserStore } from '../../globalState/user';
import { useNotificationsStore } from '../../globalState/notifications';

import { IMessageItem, IRoom } from './messages.interface';

import noMessages from './noMessages.png';
import { Role } from '../../enums';
import { TenantsReviewHeader } from '../Matches/MatchesTenants/TenantsReviewHeader';
import { PropertiesReviewHeader } from '../Matches/MatchesProperties/PropertiesReviewHeader';
import { useProfileStore } from '../../globalState/profile';
import { Footer } from '../Home/Footer';
import classNames from 'classnames';
import { MatchDetails } from './MatchDetails/MatchDetails';

export const Messages = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const notificationsStore = useNotificationsStore();
  const profileStore = useProfileStore();

  const { socket } = React.useContext(SocketContext);

  const [room, setRoom] = React.useState<IRoom | null>(null);

  const [messages, setMessages] = React.useState<IMessageItem[]>([]);

  const [conversations, setConversations] = React.useState<IRoom[]>([]);

  const [filterByProperty, setFilterByProperty] = React.useState('');

  const queryParams = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  const reorderMessages = (data: any) => {
    const filteredRooms = conversations.filter((room: IRoom) => room._id.toString() !== data._id.toString());
    setConversations([data, ...filteredRooms]);
  };

  // @ts-ignore
  React.useEffect(() => {
    if (socket) {
      socket.on('update_message_list', reorderMessages);

      return () => {
        socket.off('update_message_list');
      };
    }
  }, [reorderMessages]);

  React.useEffect(() => {
    handleMatchIdInQueryParams();
  }, []);

  const handleMatchIdInQueryParams = async () => {
    try {
      const matchIdInQueryParams = queryParams.get('matchId');

      if (matchIdInQueryParams) {
        const room = await getRoomWithMatchId(matchIdInQueryParams);
        if (room) {
          chatRooms.refetch().then((response) => {
            const foundRoom = response?.data?.find((r) => r._id === room._id);

            if (foundRoom) {
              joinRoom(foundRoom);
            }
          });
        }
        navigate(`/messages`);
      }
    } catch (err) {
      throw err;
    }
  };

  const getRoomWithMatchId = async (matchId: string): Promise<IRoom | false> => {
    try {
      const { data } = await axios(userStore.auth.access_token).get(`/api/chat/matches/${matchId}`);
      return data;
    } catch (err) {
      return false;
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

  const chatRooms = useQuery<IRoom[]>(
    ['messages', filterByProperty],
    async (): Promise<any[]> => {
      const response = await axios(userStore.auth.access_token).get('/api/chat', {
        params: {
          property: filterByProperty || undefined
        }
      });

      setConversations(response.data.docs);
      return response.data.docs;
    },
    {
      refetchOnWindowFocus: false,
      initialData: []
    }
  );

  React.useEffect(() => {
    chatRooms.refetch();
  }, [filterByProperty]);

  const getMessagesForRoom = async (roomId: string) => {
    const response = await axios(userStore.auth.access_token).get(
      '/api/chat/' + roomId + '?pageSize=15&page=1'
    );
    setMessages(response.data.docs.reverse());
  };

  const handleReadMessages = async (room: IRoom) => {
    try {
      await axios(userStore.auth.access_token).put('/api/chat/read', { room_id: room._id });
      setConversations((conversations) =>
        conversations.map((c) => (c._id !== room._id ? c : { ...c, unseen_messages: 0 }))
      );
      await notificationsStore.fetchNotifications(userStore.auth.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = async (roomObj: IRoom) => {
    try {
      await getMessagesForRoom(roomObj._id);
      await handleReadMessages(roomObj);
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
        className={classNames('messages-page', className, {
          'no-messages': !chatRooms.isFetching && chatRooms.data?.length === 0
        })}>
        <div className='header-and-content-wrapper'>
          <Header
            middleContent={
              <>
                {profileStore.role === Role.Landlord && <TenantsReviewHeader />}
                {profileStore.role === Role.Tenant && <PropertiesReviewHeader />}
              </>
            }
          />

          {chatRooms.isFetching && <ShowGlobalLoading />}
          {!chatRooms.isFetching && chatRooms.data?.length === 0 && (
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
          {chatRooms.isFetching && <div />}
          {!chatRooms.isFetching && chatRooms.data?.length !== 0 && (
            <div className='container'>
              <div className='chats'>
                <div className='chats-header'>
                  <Typography variant='body2'>My messages</Typography>

                  <Typography variant='body5'>
                    Here you can find all your conversations with your matches or Lostfish representatives
                  </Typography>
                </div>

                <MessagesProperties
                  onPropertySelect={(propertyId) => {
                    setFilterByProperty(propertyId);
                  }}
                />

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
                        room={row}
                        active={room?._id === row?._id}
                      />
                    );
                  })}
                </div>
              </div>

              {room ? (
                1 == 1 ? (
                  <ChatBox
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
                      transaction agreement. This document allows every party involved to have a transparent
                      and legal view over the entire process. Don’t worry, all your progress will remain
                      saved.
                    </Typography>

                    <Button className='go-to-transaction-button'>Go to transaction agreement</Button>
                  </div>
                )
              ) : (
                <div />
              )}
              {room?.property ? (
                <>
                  <MatchDetails room={room} />
                  {/*<DocumentsTest room={room} />*/}
                </>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
})`
  &.messages-page {
    z-index: 1;
    min-height: 0;
    height: 100vh;
    display: grid;
    box-sizing: border-box;
    grid-template-rows: auto min-content;
    position: relative;

    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), lightgray 50% / cover no-repeat;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      box-sizing: border-box;
    }

    .no-messages-view {
      display: grid;
      justify-items: center;
      align-content: center;
      min-height: calc(100vh - 112px);
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
      min-height: calc(100vh - 112px);
      box-sizing: border-box;
    }

    .chats {
      display: grid;
      grid-template-rows: min-content min-content auto;
      row-gap: 24px;
      height: 100%;
      overflow-y: auto;

      .chats-header {
        display: grid;
        row-gap: 12px;
      }

      .conversations-list {
        display: grid;
        row-gap: 8px;
        height: 100%;
        overflow-y: auto;
        align-content: flex-start;
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
