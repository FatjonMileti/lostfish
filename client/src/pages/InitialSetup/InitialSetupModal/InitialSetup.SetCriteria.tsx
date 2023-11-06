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
})`
  &.initial-setup-set-criteria {
    box-sizing: border-box;
    display: grid;
    overflow-x: hidden;
    justify-items: center;
    grid-template-rows: auto min-content;
    height: 100%;

    .section-content {
      display: grid;
      justify-items: center;
      width: 100%;
      padding: 14px 36px;
      align-content: center;
      row-gap: 48px;

      .select-avatar-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        align-self: stretch;

        .title,
        .description {
          text-align: center;
        }

        .description {
          text-align: center;
          margin-top: 16px;
          align-self: stretch;
        }
      }
    }

    .section-footer {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      justify-content: space-between;
      padding: 24px 36px;
      box-sizing: border-box;

      .action-buttons {
        display: flex;
        column-gap: 24px;
        justify-content: center;
        align-items: center;
      }

      .next-button {
        justify-self: flex-end;
      }
    }
  }
`;
