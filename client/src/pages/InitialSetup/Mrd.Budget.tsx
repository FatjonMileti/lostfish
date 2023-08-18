import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import React, { HTMLAttributes } from 'react';
import { Slider } from '../../components/Slider';
export interface BudgetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value: number[];
  onChange: (newValue: number[]) => void;
}

export const Budget = styled(({ className, value, onChange }: BudgetProps) => {
  return (
    <div className={className}>
      <Typography variant='body2'>What’s your budget?</Typography>
      <div className='slider-wrapper'>
        <Typography variant='body4' className='min-text'>
          min
        </Typography>
        <Slider
          value={value}
          min={100}
          max={6000}
          step={100}
          onChange={(_, value) => {
            onChange(Array.isArray(value) ? value : [value]);
          }}
          valueLabelDisplay='on'
          valueLabelFormat={(value) => `£${value?.toLocaleString()}`}
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
