import { styled } from '@mui/system';
import { Modal, ModalProps } from '../../../components/Modal';
import classNames from 'classnames';
import { CloseButton } from '../../../components/CloseButton';
import React from 'react';
import { Typography } from '../../../components/Typography';

import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { SelectAvatar } from './InitialSetup.SelectAvatar';

interface InitialSetupModalProps extends ModalProps {
  onSelectAvatar?: (avatarIndex: number) => void;
}
export const InitialSetupModal = styled(
  ({ className, onSelectAvatar = () => {} }: InitialSetupModalProps) => {
    const [open, setOpen] = React.useState(true);
    const [avatar, setSelectedAvatar] = React.useState(0);

    return (
      <Modal className={classNames('initial-setup-modal', className)} open={open}>
        <div className='modal-header'>
          <Typography variant='body2'>Match preferences</Typography>
          <CloseButton size='large' onClick={() => setOpen(false)} />
        </div>
        <div className='modal-body'>{[<SelectAvatar onSelectAvatar={() => {}} />][0]}</div>
        <div className='modal-footer'>
          <Label size='large'>
            Next <Icon icon='chevron-right' />
          </Label>
        </div>
      </Modal>
    );
  }
)`
  &.initial-setup-modal {
    width: 100vw;
    height: 100vh;

    position: relative;
    overflow: hidden;
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw;

    border-radius: 0;

    .modal-container {
      padding: 0 !important;
      display: grid;
      grid-template-rows: max-content auto max-content;
      background: #fff;

      .modal-header {
        padding: 24px 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 2px solid #f3f4f5;
        /* Nav Shadow */
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);
      }

      .modal-body {
        padding: 48px 36px;
      }

      .modal-footer {
        padding: 24px 36px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;
