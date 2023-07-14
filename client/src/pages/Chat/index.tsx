import React, { useState, useEffect, useContext } from 'react';
import { Chat } from './Chat';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import request from '../../utils/axios';
import { useUser } from '../../context/user';
import Button from '@mui/material/Button';
import { ItemList } from './components/ItemList';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Compose } from './components/Compose';
import { useGlobalState } from '../../globalState/globalState';
import SocketContext from '../../context/SocketContext';

import { useUserStore } from '../../globalState/user';

type Username = string | undefined | null;
type Room = any | null;
export const ChatPage = () => {
  const [username, setUsername] = useState<Username>(null);
  const [room, setRoom] = useState<Room>(null);
  const [isOnCreate, setIsOnCreate] = useState(false);

  const [messages, setMessages] = useState<any>([]);

  const { socket } = useContext(SocketContext);

  const user = useUserStore();

  const { userDetails, auth } = user;

  console.log({ userDetails });

  useEffect(() => {
    setUsername(userDetails?.username);
  }, [userDetails]);

  // @ts-ignore
  useEffect(() => {
    if (socket) {
      socket.on('receive_room_id', async (data: any) => {
        setRoom(data);
        socket.emit('join_room', data._id);
        await getMessagesForRoom(data._id);
      });
      return () => {
        socket.off('receive_room_id');
      };
    }
  }, [socket]);

  const handleChatAfterCreation = async () => {
    await getMessagesForRoom(room._id);
    setIsOnCreate(false);
  };

  const getMessagesForRoom = async (roomId: string) => {
    const response = await request(auth.access_token).get('/api/chat/' + roomId + '?pageSize=10&page=1');
    setMessages(response.data.docs);
  };

  const getMessageList = async () => {
    const response = await request(auth.access_token).get('/api/chat');
    return response.data.docs;
  };

  const { isLoading, isFetching, isFetched, data, refetch } = useQuery(['messages', room], () =>
    getMessageList()
  );

  if (!user || isLoading) {
    return <h1>Loading...</h1>;
  }

  const joinRoom = async (roomObj?: any | null) => {
    if (username && roomObj) {
      await getMessagesForRoom(roomObj._id);
      setRoom(roomObj);
      if (socket) return socket.emit('join_room', roomObj._id);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box>
            <Typography variant='h3'>Chats</Typography>
            <hr />
            <TextField
              label='Serch chat'
              variant='outlined'
              placeholder='Start typing'
              size='small'
              sx={{ marginBottom: '3rem', width: '70%', marginLeft: '1rem' }}
            />
            <Button
              size='small'
              sx={{ marginLeft: '1rem', marginTop: '3px' }}
              onClick={() => {
                setIsOnCreate(true);
                setRoom(null);
              }}>
              Compose
            </Button>
          </Box>

          <ItemList rows={data} joinRoom={joinRoom} />
        </Grid>
        <Grid item xs={8}>
          {isOnCreate && !room && (
            <Compose
              username={userDetails?.username}
              user_id={userDetails?.user_id}
              socket={socket}
              handleBehavior={handleChatAfterCreation}
            />
          )}
          {room && (
            <Chat
              username={userDetails?.username}
              room={room}
              user_id={userDetails?.user_id}
              messages={messages}
              socket={socket}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
