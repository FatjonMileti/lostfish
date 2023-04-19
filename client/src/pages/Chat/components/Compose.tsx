import React, { useEffect, useState } from "react";
import '../Chat.css'
import request from "../../../utils/axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useUser } from "../../../context/user";
export const  Compose = (props: any)=> {
  const { socket, username,user_id } = props
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [participant, setParticipant] = useState<string>("")
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([])

  useEffect(() => {
    getUsers()
  },[])

  const user = useUser()

  const getUsers = async () => {
    const response = await request(user?.state?.token).get('/api/user')
    setUserList(response.data.docs)
  }

  const sendMessage = async () => {
    if(!currentMessage){
      return
    }
    const messageBody: any = {
      "participant": participant,
      "author": user_id,
      "message": currentMessage,
      "sender": user_id,
      "time":
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    }
    await socket.emit("send_message", messageBody);
    messageBody.isCurrentUser = true
    // @ts-ignore
    setMessageList((prevMessages: any) => [...prevMessages, messageBody])
    setCurrentMessage("");
  };

  const handleChange = (event: SelectChangeEvent) => {
    setParticipant(event.target.value as string);
  };


  return (
    <div className="chat-window">
      <div className="chat-header-1">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">To</InputLabel>
          <Select
            value={participant}
            onChange={handleChange}
          >
            {userList.map((usr: any) => {
              return <MenuItem value={usr._id} key={usr._id}>{`${usr.first_name} ${usr.last_name}`}</MenuItem>
            })}
          </Select>
        </FormControl>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent: any, index: number) => {

            const authorId = messageContent?.author?._id ?? messageContent.author

            return (
              <div
                className="message"
                id={authorId.toString() === user_id.toString() ? "you" : "other"}
                key={index}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  {messageContent.isCurrentUser
                    ? <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{username}</p>
                    </div>
                    :
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent?.sender?.first_name}</p>
                    </div>
                  }

                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
