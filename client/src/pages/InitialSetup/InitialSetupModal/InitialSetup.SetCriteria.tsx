import { styled } from '@mui/system';
import React from 'react';

import { HTMLMotionProps } from 'framer-motion';

import { SetCriteriaModal } from '../../SetCriteria/SetCriteriaModal';

export interface SelectAvatarProps extends HTMLMotionProps<'div'> {
  onNext: () => void;
  onBack: () => void;
}

export const SetCriteria = styled(({ className, onNext, onBack, ...rest }: SelectAvatarProps) => {
  const [showModal, setShowModal] = React.useState(true);

  return (
    <SetCriteriaModal open={showModal} onBack={onBack} afterRefineSearch={onNext} onBackdropClick={onBack} />
  );
})``;
