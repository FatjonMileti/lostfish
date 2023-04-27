import React from 'react';
import { styled } from '@mui/system';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
}

export const IconButton = styled(
  ({ className, children, size = 'medium', type = 'button', ...rest }: IconButtonProps) => {
    return (
      <button type={type} className={`icon-button ${className} ${size}`} {...rest}>
        {children}
      </button>
    );
  }
)`
  font-weight: 600;
  font-size: 16px;
  color: #184d6d;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  border-radius: 50%;
  cursor: pointer;

  border: 1px solid #184d6d;

  &.small {
    padding: 6px;
  }

  &.medium {
    padding: 12px;
  }

  &.large {
    padding: 16px;
  }
`;
