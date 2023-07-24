import { styled } from '@mui/system';
import React, { DialogHTMLAttributes } from 'react';

export interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onBackdropClick?: () => void;
  disableScrollLock?: boolean;
  closeModal?: () => void;
  preMount?: boolean;
}

export const Modal = styled(
  ({
    children,
    open,
    onClose = () => {},
    className,
    onBackdropClick = () => {},
    disableScrollLock = false,
    preMount = false
  }: ModalProps) => {
    React.useEffect(() => {
      if (disableScrollLock) return;
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [open]);

    return (
      <>
        {(open || preMount) && (
          <div
            onClick={onBackdropClick}
            style={{
              display: open ? 'initial' : 'none',
              position: 'fixed',
              inset: 0,
              zIndex: '99',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(2px)'
            }}>
            <div className={`modal ${className}`} onClick={(e) => e.stopPropagation()}>
              <div className='modal-container'>{children}</div>
            </div>
          </div>
        )}
      </>
    );
  }
)`
  &.modal {
    padding: 0;
    border-radius: 16px;
    border: none;
    background: white;
    position: absolute;
    box-sizing: border-box;
    min-width: 200px;
    min-height: 100px;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .modal-container {
      padding: 24px;
      box-sizing: border-box;
      height: 100%;
    }
  }
`;
