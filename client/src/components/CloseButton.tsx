import React, { HTMLAttributes } from 'react';
import { styled } from '@mui/system';
import { IconButton } from './IconButton';
import { Icon } from './Icon';
import classNames from 'classnames';

export interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  inverted?: boolean;
  background?: boolean;
  size?: 'large' | 'small';
}

export const CloseButton = styled(
  ({ className, inverted = false, background = true, size = 'large', ...props }: CloseButtonProps) => {
    return (
      <IconButton
        className={classNames('close-button', className, `size-${size}`, {
          inverted,
          background
        })}
        {...props}>
        <Icon icon='close' color='white' />
      </IconButton>
    );
  }
)`
  &.close-button {
    display: grid;
    align-content: center;
    justify-items: center;

    background-color: inherit;
    box-sizing: border-box;
    border-style: solid;
    border-color: transparent;

    &:hover {
      background: #e7e7e7;
    }

    &.background {
      border-color: #f3f4f5;
      &:hover {
        background: #c0daff;
        border-color: #c0daff;
      }
    }

    &.inverted {
      background-color: #184d6d;
      border-color: #184d6d;
      .icon {
        color: white;
      }
      &:hover {
        background-color: white;
        border-color: white;
        .icon {
          color: #0d2a38;
        }
      }
    }

    &.size-large {
      padding: 12px;
      width: 48px;
      height: 48px;
      border-width: 2px;
    }

    &.size-small {
      padding: 4px;
      width: 32px;
      height: 32px;
      border-width: 1px;
    }

    .icon {
      width: 24px;
      height: 24px;
      color: #0d2a38;
    }
  }
`;
