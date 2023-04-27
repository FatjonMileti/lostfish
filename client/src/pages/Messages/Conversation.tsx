import { styled } from '@mui/system';

import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from '@mui/material/Avatar';
import { Typography } from '../../components/Typography';

import React from 'react';
import { useGlobalState } from '../../globalState';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

export const Conversation = styled(
  (props: {
    rows: any[];
    joinRoom: (roomId?: string) => void;
    fullName: string;
    row: any;
    className?: string;
  }) => {
    const { rows, joinRoom, fullName, row, className } = props;

    console.log({ rows });

    let {
      user: [user]
    } = useGlobalState();

    const { userDetails } = user;

    return (
      <div className={`conversation ${className}`} onClick={() => joinRoom(row)}>
        {/*<Avatar {...stringAvatar(fullName)} />*/}
        <div className='avatar' style={{ backgroundColor: stringToColor(fullName) }}>
          {fullName.split(' ')[0][0]}
          {fullName.split(' ')[1][0]}
        </div>

        <Typography variant='body4'>{fullName}</Typography>
      </div>
    );
  }
)`
  &.conversation {
    display: flex;
    column-gap: 10px;
    padding: 16px;
    align-items: center;

    border-bottom: 1px solid #cfd5d5;
    box-sizing: border-box;

    color: #0d2a38;
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;

    &:hover {
      cursor: pointer;
      border-radius: 12px;
      background-color: #ffffff;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Roobert;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
