import { styled } from '@mui/system';
import { SetCriteria } from './SetCriteria/SetCriteria';
import React from 'react';
import { Modal, ModalProps } from '../../components/Modal';

interface SetCriteriaModalProps extends ModalProps {}
export const SetCriteriaModal = styled(({ ...rest }: SetCriteriaModalProps) => {
  const afterRefineSearch = () => {};

  return (
    <Modal {...rest}>
      <SetCriteria onClose={() => {}} afterRefineSearch={afterRefineSearch} />
    </Modal>
  );
})``;
