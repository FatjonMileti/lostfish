import { styled } from '@mui/system';
import { LoadingMatch } from './LoadingMatch';
import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
}
export const Backdrop = styled(({ className, open }: BackdropProps) => {
  return createPortal(
    <>
      {open && (
        <motion.div className={className}>
          <LoadingMatch />
        </motion.div>
      )}
    </>,
    document.body
  );
})`
  & {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;

    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);

    display: grid;
    justify-content: center;
    align-items: center;

    //cursor: wait;
  }
`;
