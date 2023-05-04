import { styled } from '@mui/system';
import React from 'react';

import MuiSwitch, { SwitchProps } from '@mui/material/Switch';

export const Switch = styled(
  React.forwardRef<HTMLButtonElement, SwitchProps>(({ size, ...props }, ref) => (
    <MuiSwitch size={size} {...props} ref={ref} />
  ))
)`
  & {
    &.MuiSwitch-root {
      padding: 0;
      width: 40px;
      height: 24px;

      &.MuiSwitch-sizeMedium {
        width: 48px;
        height: 32px;
      }

      .MuiButtonBase-root {
        padding: 0;
        &.Mui-checked {
          transform: translateX(16px);

          .MuiSwitch-thumb {
            background-color: #0d2a38;
          }

          .MuiSwitch-track {
            background-color: #c0daff;
          }
        }
      }
    }

    &.MuiSwitch-sizeMedium {
      .MuiSwitch-thumb {
        width: 32px;
        height: 32px;
      }
    }

    &.MuiSwitch-sizeMedium {
      .MuiSwitch-track {
        height: 24px;
        width: 48px;
        border-radius: 12px;
        transform: translateY(4px);
      }
    }

    .MuiSwitch-thumb {
      background-color: #a7a7a7;
      width: 24px;
      height: 24px;
      box-shadow: none;
    }

    .MuiSwitch-track {
      background-color: #cfd5d5;
      height: 16px;
      width: 40px;
      border-radius: 8px;
      transform: translateY(4px);
    }
  }
`;
