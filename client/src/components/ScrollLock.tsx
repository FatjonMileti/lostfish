import React from 'react';

export const ScrollLock = ({ lock = true }: { lock?: boolean }) => {
  const openedOnceRef = React.useRef(false);
  React.useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
      openedOnceRef.current = true;
    } else if (!lock && openedOnceRef.current) {
      document.body.style.overflow = 'unset';
    }
    if (openedOnceRef.current) {
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [lock]);

  return null;
};
