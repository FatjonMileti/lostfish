import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';

export const ProfileDetails = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <Typography>Profile</Typography>
    </div>
  );
})``;
