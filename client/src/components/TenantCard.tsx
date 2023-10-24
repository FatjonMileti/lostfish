import { styled } from '@mui/system';
import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import classNames from 'classnames';
import { Avatar } from './Avatar';
import { Typography } from './Typography';
import { Label } from './Label';

export interface TenantCardProps extends HTMLMotionProps<'div'> {
  name: string;
  inView: boolean;
  avatar: string;
  percentage?: string;
  onViewProfileClick?: () => void;
  size?: 'medium' | 'large';
}

export const TenantCard = styled(
  ({
    className,
    size = 'medium',
    name,
    inView,
    avatar,
    percentage,
    onViewProfileClick = () => {},
    ...rest
  }: TenantCardProps) => {
    const active = inView;
    return (
      <motion.div
        className={classNames('tenant-card', className, `size-${size}`, { active, inView })}
        {...rest}>
        <Avatar image={avatar} className={`${active ? 'active' : ''}`} />

        <div className='action-buttons'>
          <div className='tenant-details'>
            <Typography variant='body4' className='tenant-name'>
              {name}
            </Typography>

            <Typography variant='body4' className='tenant-match-percentage'>
              {percentage ?? '34'}% Match rate
            </Typography>
          </div>
          <Label
            size='medium'
            variant='secondary'
            className='view-profile-button'
            onClick={onViewProfileClick}>
            View profile
          </Label>
        </div>
      </motion.div>
    );
  }
)`
  &.tenant-card {
    padding: 24px;
    display: grid;
    row-gap: 24px;
    height: auto;
    flex-shrink: 0;
    align-content: space-between;
    opacity: 0.5;
    width: 440px;
    box-sizing: border-box;
    justify-items: center;

    &.inView {
      z-index: 1;
      opacity: 1;
      background-color: white;
      border-radius: 16px;

      /* Card Shadow */
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    }

    .avatar {
      position: relative;
      width: 324px;
      height: 324px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;
      box-sizing: border-box;

      &.active {
        box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);
      }
    }

    &.inView {
      .action-buttons {
        opacity: 1;
      }
    }
    .action-buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;
      column-gap: 16px;
      align-items: center;
      opacity: 0;

      .tenant-details {
        display: grid;
        row-gap: 4px;

        align-items: center;

        .tenant-name {
          font-weight: 700;
        }

        .tenant-match-percentage {
          color: #c4b1a3;
          font-weight: 700;
        }
      }

      .view-profile-button {
        flex-shrink: 0;
        padding: 16px 20px;
        height: 56px;
      }
    }
  }
`;
