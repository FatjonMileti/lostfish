import { styled } from '@mui/system';
import React, { DialogHTMLAttributes } from 'react';

export interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onBackdropClick?: Function;
}

export const Modal = styled(
  ({ children, open, onClose = (f: any) => f, className, onBackdropClick = () => {} }: ModalProps) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    React.useEffect(() => {
      if (!!dialogRef.current) {
        if (open) {
          if (!dialogRef.current.open) {
            dialogRef.current.showModal();
            document.body.style.overflow = 'hidden';
          }
        } else {
          if (dialogRef.current.open) {
            dialogRef.current.close();
            document.body.style.overflow = 'unset';
          }
        }
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [open]);

    const handleClick = (event: React.MouseEvent<HTMLDialogElement, MouseEvent>): void => {
      const target = event.target as HTMLDialogElement;
      if (target.tagName === 'DIALOG') {
        onBackdropClick();
      }
    };

    return (
      <dialog className={`modal ${className}`} ref={dialogRef} onClose={onClose} onClick={handleClick}>
        <div className='modal-container'>{children}</div>
      </dialog>
    );
  }
)`
  & {
    padding: 0;
    border-radius: 16px;
    border: none;

    .modal-container {
      padding: 24px;
      box-sizing: border-box;
      height: 100%;
    }
  }
`;
