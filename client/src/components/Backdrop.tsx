import { styled } from '@mui/system';
import { LoadingMatch } from './LoadingMatch';
import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

import { create } from 'zustand';

interface BackdropStoreType {
  ids: any;
  setState: (
    partial:
      | BackdropStoreType
      | Partial<BackdropStoreType>
      | ((state: BackdropStoreType) => BackdropStoreType | Partial<BackdropStoreType>),
    replace?: boolean | undefined
  ) => void;
}

const useBackdropStore = create<BackdropStoreType>((setState) => {
  return {
    ids: {},
    setState
  };
});

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
}

export const Backdrop = ({ className, open }: BackdropProps) => {
  const bacdropStore = useBackdropStore();
  const id = React.useId();

  React.useEffect(() => {
    if (open) {
      bacdropStore.setState(({ ids }) => {
        ids[id] = true;
        return { ids };
      });
    } else {
      bacdropStore.setState(({ ids }) => {
        delete ids[id];
        return { ids };
      });
    }

    return () => {
      bacdropStore.setState(({ ids }) => {
        delete ids[id];
        return { ids };
      });
    };
  }, [open]);

  return null;
};

export const GlobalLoading = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const bacdropStore = useBackdropStore();

  return Object.values(bacdropStore.ids).length > 0
    ? createPortal(
        <>
          <motion.div className={className}>
            <LoadingMatch />
          </motion.div>
        </>,
        document.body
      )
    : null;
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

    cursor: wait;
  }
`;
