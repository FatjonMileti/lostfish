import React, { useEffect, useState } from "react";
import './Chat.css'

export const  Chat = (props: any)=> {
    const { socket, username,user_id, room, messages } = props
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const isAuthor = room.author._id.toString() === user_id.toString()

    useEffect(() => {
        setMessageList(messages.reverse())
    },[messages])

    const sendMessage = async () => {
        if(!currentMessage){
            return
        }
        const messageBody: any = {
            "room_id": room._id,
            "participant": !isAuthor ? user_id : room.participant._id,
            "author": isAuthor ? user_id : room.participant._id,
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

    useEffect(() => {
        socket.on("receive_message", (data: any) => {
            // @ts-ignore
            setMessageList((list: any) => [...list, data]);
        });
    }, [socket]);


    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat with: {isAuthor
                  ? `${room.participant.first_name} ${room.participant.last_name}`
                  : `${room.author.first_name} ${room.author.last_name}` }</p>
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
