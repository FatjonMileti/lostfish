import { styled } from '@mui/system';
import { TextField } from '../../components/TextField';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import React, { HTMLAttributes } from 'react';

export const Chatbox = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`chat-box ${className}`}>
      <div className='conversation'>messages</div>
      <div className='write-box'>
        <TextField
          variant='standard'
          placeholder='Type your message here...'
          endAdornment={
            <IconButton style={{ border: 'none' }}>
              <Icon icon='attach' color='#184D6D' size={18} />
            </IconButton>
          }
        />
        <Button
          className='send-button'
          size='small'
          endIcon={<Icon icon='send-message' color='white' size={18} />}>
          Send
        </Button>
      </div>
    </div>
  );
})`
  &.chat-box {
    /* Auto layout */

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 672px;
    height: 708px;

    filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
    border-radius: 16px;

    /* Inside auto layout */

    flex: none;

    flex-grow: 0;

    .conversation {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      padding: 24px;
      gap: 16px;

      width: 672px;
      height: 628px;

      box-sizing: border-box;

      background: #ffffff;

      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    .write-box {
      width: 672px;
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
