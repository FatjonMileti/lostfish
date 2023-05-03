import { styled } from '@mui/system';
import { TextField } from '../../components/TextField';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { Typography } from '../../components/Typography';
import { stringToColor } from './Conversation';

export interface ChatboxProps extends HTMLAttributes<HTMLDivElement> {
  username: string;
  room: any;
  user_id: string;
  messages: any;
  socket: any;
}

export const Chatbox = styled(({ className, username, room, user_id, messages, socket }: ChatboxProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<any[]>([]);

  const isAuthor = room.author._id.toString() === user_id.toString();

  const once = React.useRef(false);
  const conversationBoxRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    if (!once.current) {
      socket.on('receive_message', (data: any) => {
        // @ts-ignore
        setMessageList((list: any) => [...list, data]);
      });
      once.current = true;
    }
  }, [socket]);

  React.useEffect(() => {
    if (conversationBoxRef.current) {
      conversationBoxRef.current;

      conversationBoxRef.current.scrollTop = conversationBoxRef.current.scrollHeight;
    }
  }, [messageList]);

  const sendMessage = async () => {
    if (!currentMessage) {
      return;
    }
    const messageBody: any = {
      room_id: room._id,
      participant: !isAuthor ? user_id : room.participant._id,
      author: isAuthor ? room.author : room.participant,
      message: currentMessage,
      sender: user_id,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    };
    await socket.emit('send_message', messageBody);
    messageBody.isCurrentUser = true;
    // @ts-ignore
    setMessageList((prevMessages: any) => [...prevMessages, messageBody]);
    setCurrentMessage('');
  };

  return (
    <div className={`chat-box ${className}`}>
      <div className='conversation' ref={conversationBoxRef}>
        {messageList.map((messageContent: any, messageIndex: number) => {
          const authorId = messageContent?.author?._id;

          const fromMe = authorId.toString() === user_id.toString();

          const isLastMessageFromAuthor =
            messageList.findLastIndex((m) => m.author._id === authorId) === messageIndex;

          const isFirstInGroup =
            !messageList[messageIndex - 1] || messageList[messageIndex - 1]?.author?._id !== authorId;

          const inMiddleOfGroup =
            messageList[messageIndex - 1]?.author?._id === authorId &&
            messageList[messageIndex + 1]?.author?._id === authorId;

          const lastInGroup =
            messageList[messageIndex - 1]?.author?._id === authorId &&
            (!messageList[messageIndex + 1] || messageList[messageIndex + 1]?.author?._id !== authorId);

          return (
            <div
              className={`message ${fromMe ? 'from-me' : 'from-you'} ${
                isLastMessageFromAuthor ? 'last' : ''
              } ${isFirstInGroup ? 'first-in-group' : ''} ${inMiddleOfGroup ? 'in-middle-of-group' : ''} ${
                lastInGroup ? 'last-in-group' : ''
              }`}
              key={messageIndex}>
              <div
                className='avatar'
                style={{
                  backgroundColor: stringToColor(
                    messageContent.author.first_name + ' ' + messageContent.author.last_name
                  )
                }}>
                {messageContent.author.first_name[0]}
                {messageContent.author.last_name[0]}
              </div>

              <Typography variant='body5' className='text'>
                {messageContent.message}
              </Typography>
            </div>
          );
        })}
      </div>
      <div className='write-box'>
        <TextField
          variant='standard'
          placeholder='Type your message here...'
          endAdornment={
            <IconButton style={{ border: 'none' }}>
              <Icon icon='attach' color='#184D6D' size={18} />
            </IconButton>
          }
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <Button
          className='send-button'
          size='small'
          endIcon={<Icon icon='send-message' color='white' size={18} />}
          onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
})`
  &.chat-box {
    filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
    border-radius: 16px;
    display: grid;
    grid-template-rows: auto 80px;
    overflow-y: auto;

    .conversation {
      overflow-y: auto;

      display: grid;
      grid-template-rows: 1fr;
      grid-auto-rows: max-content;
      align-items: flex-end;

      gap: 16px;
      padding: 24px;

      background: #ffffff;

      border-top-left-radius: 16px;
      border-top-right-radius: 16px;

      box-sizing: border-box;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        //box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }

      &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
      }

      .message {
        max-width: 80%;
        height: min-content;

        display: grid;
        grid-template-columns: min-content auto;
        column-gap: 4px;

        .avatar {
          align-self: flex-end;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;

          font-size: 12px;
          font-family: 'Roobert';
          font-weight: 600;

          visibility: hidden;
        }

        .text {
          padding: 12px;
        }

        &.from-you {
          grid-template-columns: auto min-content;
          .avatar {
            order: 2;
          }
        }

        &.from-me {
          justify-self: flex-start;

          .text {
            background-color: rgba(192, 218, 255, 1);
            color: rgba(13, 42, 56, 1);
            border-radius: 16px 16px 16px 16px;
          }

          &.first-in-group {
            .text {
              border-bottom-left-radius: 0;
            }
          }

          &.in-middle-of-group {
            margin-top: -12px;
            .text {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }

          &.last-in-group {
            margin-top: -12px;
            .text {
              border-bottom-left-radius: 16px;
            }
          }

          & + .from-me {
            .text {
              border-top-left-radius: 0;
            }
          }
        }

        &.from-you {
          justify-self: flex-end;

          .text {
            background-color: rgba(207, 213, 213, 1);
            color: rgba(0, 0, 0, 1);
            border-radius: 16px 16px 16px 16px;
          }

          &.first-in-group {
            .text {
              border-bottom-right-radius: 0;
            }
          }

          &.in-middle-of-group {
            margin-top: -12px;
            .text {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }

          &.last-in-group {
            margin-top: -12px;
            .text {
              border-top-right-radius: 0;
            }
          }

          & + .from-you {
            .text {
              border-top-right-radius: 0;
            }
          }
        }

        &.last {
          .avatar {
            visibility: visible;
          }
        }
      }
    }

    .write-box {
      height: 80px;

      background: #fafafa;

      display: grid;
      grid-template-columns: auto min-content;
      align-items: flex-start;
      padding: 16px 24px;
      gap: 24px;
      box-sizing: border-box;

      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;

      .send-button {
        text-transform: none;
      }
    }
  }
`;
