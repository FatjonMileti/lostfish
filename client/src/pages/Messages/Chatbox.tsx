import { styled } from '@mui/system';
import { TextField } from '../../components/TextField';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import React, { HTMLAttributes, MouseEventHandler, useEffect, useState } from 'react';
import { Typography } from '../../components/Typography';
import { stringToColor } from './Conversation';
import { IMessageBody, IMessageItem } from './messages.interface';
import { Socket } from 'socket.io-client';

export interface ChatboxProps extends HTMLAttributes<HTMLDivElement> {
  username: string;
  room: any;
  user_id: string;
  messages: IMessageItem[];
  socket: Socket | null;
  closeDeal?: MouseEventHandler;
  updateList?: (data: any) => void;
}

export const Chatbox = styled(
  ({ className, updateList, room, user_id, messages, socket, closeDeal = () => {} }: ChatboxProps) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState<IMessageItem[]>([]);

    const isAuthor = room.author._id.toString() === user_id.toString();

    const conversationBoxRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      setMessageList(messages);
    }, [messages]);

    useEffect(() => {
      if (socket) {
        socket.on('receive_message', (data: any) => {
          setMessageList((list: IMessageItem[]) => [...list, data]);
        });

        return () => {
          socket.off('receive_message');
        };
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

      const messageBody: IMessageBody = {
        room_id: room._id,
        message: currentMessage,
        sender: user_id
      };

      const messageItem: IMessageItem = {
        ...messageBody,
        participant: !isAuthor ? user_id : room.participant._id,
        author: isAuthor ? room.author : room.participant,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
        sender: isAuthor ? room.author : room.participant
      };

      if (!room.hasOwnProperty('last_message')) {
        room.last_message = {
          message: ''
        };
      }

      if (socket) await socket.emit('send_message', messageBody);

      messageItem.isCurrentUser = true;
      setMessageList((prevMessages: IMessageItem[]) => [...prevMessages, messageItem]);
      room.last_message.message = currentMessage;
      room.unseen_messages = 0;
      updateList && updateList(room);
      setCurrentMessage('');
    };

    return (
      <div className={`chat-box ${className}`}>
        <div className='chatbox-header'>
          <div className='chatbox-header-texts'>
            <Typography variant='body4' style={{ fontWeight: 600 }}>
              Ready to close the deal?
            </Typography>
            <Typography variant='body5'>
              Click the “Close deal” button and you’ll be redirected to complete the transaction.
            </Typography>
          </div>
          <div className='chatbox-header-actions'>
            <Button startIcon={<Icon icon='close' size={16} />}>Unmatch</Button>
            <Button inverted startIcon={<Icon icon='checked' size={14} />} onClick={closeDeal}>
              Close deal
            </Button>
          </div>
        </div>
        <div className='conversation' ref={conversationBoxRef}>
          {messageList.map((messageContent: IMessageItem, messageIndex: number) => {
            const authorId = messageContent?.sender?._id;

            const fromMe = authorId.toString() === user_id.toString();
            const isLastMessageFromAuthor =
              messageList.findLastIndex((m) => m.sender._id === authorId) === messageIndex;

            const isFirstInGroup =
              !messageList[messageIndex - 1] || messageList[messageIndex - 1]?.sender?._id !== authorId;

            const inMiddleOfGroup =
              messageList[messageIndex - 1]?.sender?._id === authorId &&
              messageList[messageIndex + 1]?.sender?._id === authorId;

            const lastInGroup =
              messageList[messageIndex - 1]?.sender?._id === authorId &&
              (!messageList[messageIndex + 1] || messageList[messageIndex + 1]?.sender?._id !== authorId);

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
                  {messageContent.sender.first_name[0]}
                  {messageContent.sender.last_name[0]}
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
            placeholder='Type your message here...'
            endAdornment={
              <IconButton noBackground>
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
          <Button className='send-button' variant='secondary' size='small' onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    );
  }
)`
  &.chat-box {
    filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
    border-radius: 16px;
    display: grid;
    grid-template-rows: min-content auto 80px;
    overflow-y: auto;

    .chatbox-header {
      background-color: #0d2a38;
      align-items: center;

      display: flex;
      padding: 16px 24px;
      justify-content: space-between;

      .chatbox-header-texts {
        display: flex;
        flex-direction: column;
        color: white;
      }

      .chatbox-header-actions {
        display: flex;
        column-gap: 16px;
      }
    }

    .conversation {
      overflow-y: auto;

      display: grid;
      grid-template-rows: 1fr;
      grid-auto-rows: max-content;
      align-items: flex-end;

      gap: 16px;
      padding: 24px;

      background: #ffffff;

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
            background-color: #e7e7e7;
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
            background-color: #184d6d;
            color: white;
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

      background: #e7e7e7;

      display: grid;
      grid-template-columns: auto min-content;
      align-items: flex-start;
      padding: 16px 24px;
      gap: 24px;
      box-sizing: border-box;

      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;

      .text-field {
        border-radius: 8px;
        .input-wrapper {
          border: none;
          background-color: white;
        }
      }

      .send-button {
        padding-inline: 67px;
      }
    }
  }
`;
