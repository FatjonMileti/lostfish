import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';

import { Button } from '../../../components/Button';
import { ArrowButton } from '../../../components/ArrowButton';
import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';

import { avatars } from '../../HomeLoggedIn/avatars';
import classNames from 'classnames';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { HTMLMotionProps, motion } from 'framer-motion';
import { AddPropertyModal } from '../../Properties/NewProperty/AddPropertyModal';
import { SetCriteriaModal } from '../../SetCriteria/SetCriteriaModal';

export interface SelectAvatarProps extends HTMLMotionProps<'div'> {
  onNext: () => void;
  onBack: () => void;
}

export const SetCriteria = styled(({ className, onNext, onBack, ...rest }: SelectAvatarProps) => {
  const [showModal, setShowModal] = React.useState(true);

  return <SetCriteriaModal open={showModal} />;
})``;
