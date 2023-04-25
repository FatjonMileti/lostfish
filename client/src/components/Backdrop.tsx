import styled from '@emotion/styled';
import { Backdrop as MuiBackdrop } from '@mui/material';

import { keyframes } from '@emotion/react';

const pulseOpacity = keyframes`
  0% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.05;
  }
`;

export const Backdrop = styled(MuiBackdrop)`
  background-repeat: no-repeat;
  background-size: cover;

  animation: ${pulseOpacity} 2s ease-out;
  animation-iteration-count: infinite;
  opacity: 1;
  cursor: wait;
`;
