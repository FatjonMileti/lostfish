import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { styled } from '@mui/system';

import { Avatar } from './Avatar';
import { IconButton } from './IconButton';
import { Icon } from './Icon';

interface AccountIconProps extends HTMLAttributes<HTMLDivElement> {
  image?: string;
}
export const AccountIcon = styled(({ image, className, ...rest }: AccountIconProps) => {
  return (
    <div className={classNames('account-icon', className)} {...rest}>
      <Avatar image={image} />
      <IconButton className='account-button'>
        <Icon icon='arrow-right' />
      </IconButton>
    </div>
  );
})`
  &.account-icon {
    height: 56px;
    width: 56px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;

    &:hover {
      .avatar {
        left: -56px;
      }
      .account-button {
        left: 0;
      }
    }

    .avatar {
      height: 56px;
      width: 56px;
      border: 2px solid #c4b1a3;
      box-sizing: border-box;
      cursor: pointer;

      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1;

      transition: left 0.2s ease-in-out;
    }

    .account-button {
      height: 56px;
      width: 56px;
      position: absolute;
      top: 0;
      left: 56px;
      bottom: 0;
      background-color: #eee0d3;
      transition: left 0.2s ease-in-out;

      .icon {
        width: 24px !important;
        height: 24px !important;
      }
    }
  }
`;
