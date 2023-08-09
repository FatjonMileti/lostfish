import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import React, { HTMLAttributes } from 'react';
import { Slider } from '../../../components/Slider';
export interface BedroomsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value: number[];
  onChange: (newValue: number[]) => void;
}

export const Bedrooms = styled(({ className, value, onChange }: BedroomsProps) => {
  return (
    <div className={className}>
      <Typography variant='body2'>How many bedrooms?</Typography>
      <div className='slider-wrapper'>
        <Typography variant='body4' className='min-text'>
          min
        </Typography>
        <Slider
          value={value}
          min={0}
          max={5}
          step={1}
          onChange={(_, value) => {
            onChange(Array.isArray(value) ? value : [value]);
          }}
          valueLabelDisplay='on'
          valueLabelFormat={(value) => `${value}`}
        />
        <Typography variant='body4' className='max-text'>
          max
        </Typography>
      </div>
    </div>
  );
})`
  & {
    display: grid;
    justify-items: center;
    width: 576px;

    .slider-wrapper {
      display: grid;
      grid-template-columns: min-content auto min-content;
      column-gap: 23px;
      width: 100%;
      margin-top: 48px;

      .min-text,
      .max-text {
        color: #646464;
      }
    }
  }
`;
