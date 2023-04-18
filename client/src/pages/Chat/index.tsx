import {useState, useEffect} from "react";
import socket from "../../context/socket";
import { Chat } from './Chat'
import { useQuery } from '@tanstack/react-query'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axiosInstance from "../../utils/axios";
import { useUser } from "../../context/user";

export const ChatPage = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };


  const user = useUser()


  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => getMessageList(),
  })


  const getMessageList = async () => {
    const response = await axiosInstance.get('/api/chat')
    return response.data.docs
  }

  if(isLoading){
    return <h1>Loading...</h1>
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div className="App">
            {!showChat ? (
              <div className="joinChatContainer">
                <h3>Join A Chat</h3>
                <input
                  type="text"
                  placeholder="John..."
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <input
                  type="text"
                  placeholder="Room ID..."
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                />
                <button onClick={joinRoom}>Join A Room</button>
              </div>
            ) : (
              <Chat socket={socket} username={username} room={room} />
            )}
          </div>
        </Grid>
        <Grid item xs={8}>
          <Chat socket={socket} username={username} room={room} />
        </Grid>

      </Grid>
    </Box>
  );
}