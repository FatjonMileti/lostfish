import React, { useEffect, useState } from "react";
import './Chat.css'
function Chat(props: any) {

    const { socket, username,user_id, room } = props
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        joinRoom()
    },[])

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room._id);
        }
    };

    console.log({room})

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageBody: any = {
                "conversation_id": room._id,
                "participant_one": room.participant_one._id,
                "participant_two": room.participant_two._id,
                "sender": user_id,
                "message": currentMessage,
                "author": username,
                "time":
                  new Date(Date.now()).getHours() +
                  ":" +
                  new Date(Date.now()).getMinutes(),
            }


            await socket.emit("send_message", messageBody);
            // @ts-ignore
            setMessageList((list: any) => [...list, messageBody]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data: any) => {
            console.log({data})
            // @ts-ignore

            setMessageList((list: any) => [...list, data]);
        });

        return () => socket.disconnect()
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <div className="message-container">
                    {messageList.map((messageContent: any, index: number) => {
                        return (
                            <div
                                className="message"
                                id={room.last_message.sender._id === messageContent.sender ? "you" : "other"}
                                key={index}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
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

export default Chat;