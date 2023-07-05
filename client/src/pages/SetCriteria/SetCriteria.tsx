import { Modal } from '../../components/Modal';
import { styled } from '@mui/system';
import { Button } from '../../components/Button';
import React, { HTMLAttributes } from 'react';

export interface SetCriteriaProps extends HTMLAttributes<HTMLDivElement> {}

export const SetCriteria = styled(({ className }: SetCriteriaProps) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <Modal
        open={showModal}
        onBackdropClick={() => setShowModal(false)}
        className={`set-criteria-modal ${className}`}>
        Set criteria steps
      </Modal>
      <Button style={{ marginTop: '24px' }} onClick={() => setShowModal(true)}>
        Set Criteria
      </Button>
    </>
  );
})`
  &.set-criteria-modal {
  }
`;
