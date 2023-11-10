import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { ImproveTrustScoreModal } from '../../PagesComponents/ImproveTrustScoreModal';
import { Backdrop } from '../../../components/Backdrop';
import { Button } from '../../../components/Button';
import { ViewProfile } from './ViewProfile';
import { AddedTenants } from './MatchedTenants.AddedMatches';
import { SuggestedTenants } from './MatchedTenats.SuggestedMatches';
import classNames from 'classnames';
import { mapTenant } from './serializers';
import { SuggestedTenantType } from '../matches.type';

interface MatchedSlideProps extends HTMLMotionProps<'div'> {
  avatar?: string;
  active?: boolean;
  onViewProfileClick: () => void;
  setActiveSlide: () => void;
  name: string;
  percentage: number;
}

export const MatchedSlide = styled(
  ({
    className,
    avatar,
    active = false,
    onViewProfileClick,
    setActiveSlide,
    name,
    percentage,
    ...rest
  }: MatchedSlideProps) => {
    return (
      <motion.div className={classNames('match-property-slide', className, { active })} {...rest}>
        <Avatar image={avatar} className={`${active ? 'active' : ''}`} onClick={setActiveSlide} />

        <motion.div
          className='action-buttons'
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ ease: 'easeOut', duration: 0.5 }}>
          <div className='tenant-details'>
            <Typography variant='body4' className='tenant-name'>
              {name}
            </Typography>
            <Typography variant='body4' className='tenant-dot'>
              •
            </Typography>
            <Typography variant='body4' className='tenant-match-percentage'>
              {percentage ?? '34'}%
            </Typography>
          </div>
          <Button
            size='small'
            variant='secondary'
            className='view-profile-button'
            onClick={onViewProfileClick}>
            View profile
          </Button>
        </motion.div>
      </motion.div>
    );
  }
)`
  &.match-property-slide {
    display: grid;
    row-gap: 16px;
    width: 372px;
    height: auto;
    flex-shrink: 0;
    align-content: space-between;
    opacity: 0.5;

    &.active {
      z-index: 1;
      opacity: 1;
    }

    .avatar {
      position: relative;
      width: 372px;
      height: 372px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;
      box-sizing: border-box;

      &.active {
        box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;

      .tenant-details {
        display: flex;
        column-gap: 8px;
        padding: 20px 32px;
        font-weight: 700;
        align-items: center;

        .tenant-dot,
        .tenant-match-percentage {
          color: #c4b1a3;
        }
      }

      .view-profile-button {
        flex-shrink: 0;
      }
    }
  }
`;
