import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';

import { Modal } from '../../../components/Modal';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { CloseButton } from '../../../components/CloseButton';

import { PropertyForm } from './PropertyForm';
import { usePropertyForm } from './usePropertyForm';

export interface AddEditPropertyModalProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
  afterSave?: () => void;
  afterDelete?: () => void;
}

export const AddEditPropertyModal = styled(
  ({
    className,
    showStore,
    propertyId,
    afterSave = () => {},
    afterDelete = () => {}
  }: AddEditPropertyModalProps) => {
    const [modalVisibility, setModalVisibility] = showStore;

    const form = usePropertyForm();

    return (
      <Modal
        className={`add-edit-property-modal ${className}`}
        open={modalVisibility}
        onBackdropClick={() => setModalVisibility(false)}
        onClose={() => setModalVisibility(false)}>
        <div className='header'>
          <Typography variant='body2'>Add property</Typography>
          <div className='right-side'>
            {propertyId && (
              <Button
                variant='secondary'
                className='delete-button'
                startIcon={<Icon icon='trash' size={20} />}
                onClick={() => {}}>
                Delete property
              </Button>
            )}
            <CloseButton className='exit-button' onClick={() => setModalVisibility(false)} />
          </div>
        </div>
        {/*<AddEditProperty form={form} onBack={() => setModalVisibility(false)} propertyId={propertyId} />*/}
      </Modal>
    );
  }
)`
  &.add-edit-property-modal {
    overflow-y: auto;
    max-height: 100vh;
    height: auto;
    width: 100vw;

    border-radius: 0px;

    .modal-container {
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 36px;
      border-bottom: 2px solid #f3f4f5;
      box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);

      .right-side {
        display: flex;
        column-gap: 16px;
        align-items: center;

        .delete-button {
          color: #e5155a;
          border-color: #e5155a;
        }

        .exit-button {
          padding: 16px;
          width: 56px;
          height: 56px;
        }
      }
    }
  }
`;
