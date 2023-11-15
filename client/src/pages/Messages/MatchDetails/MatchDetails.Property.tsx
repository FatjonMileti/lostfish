import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { IRoom } from '../messages.interface';

interface MatchDetailsPropertyProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
}

export const MatchDetailsProperty = styled(({}: MatchDetailsPropertyProps) => {
  return <div></div>;
})``;
