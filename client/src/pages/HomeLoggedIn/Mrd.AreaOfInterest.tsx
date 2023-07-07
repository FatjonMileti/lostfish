import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { HTMLAttributes } from 'react';

export interface AreaOfInterestProps extends HTMLAttributes<HTMLDivElement> {
  areaOfInterest?: string;
  onAreaChange: (newValue: string) => void;
}

export const AreaOfInterest = styled(({ className, areaOfInterest, onAreaChange }: AreaOfInterestProps) => {
  return (
    <div className={className}>
      <Typography variant='body2'>What’s your area of interest?</Typography>

      <TextField
        placeholder='E.g. Bristol or BA1 2LR'
        value={areaOfInterest}
        onChange={({ target: { value } }) => onAreaChange(value)}
      />
    </div>
  );
})`
  & {
    display: grid;
    justify-items: center;
    row-gap: 32px;

    .text-field {
      width: 440px;
    }
  }
`;
