import React, { JSXElementConstructor, ReactElement } from 'react';
import styled from '@emotion/styled';
import { Icon } from './Icon';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'contained' | 'outlined';
  startIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
  endIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
  size?: 'small' | 'medium' | 'large';
}

export const Button = styled(
  ({
    type = 'button',
    className,
    children,
    variant = 'contained',
    startIcon,
    endIcon,
    size = 'medium',
    color,
    disabled,
    ...rest
  }: ButtonProps) => {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`button ${className} ${variant} ${size} ${color} ${disabled ? 'disabled' : ''}`}
        {...rest}>
        {startIcon && React.cloneElement(startIcon, { className: 'start-icon' })}
        {children}
        {endIcon && React.cloneElement(endIcon, { className: 'end-icon' })}
      </button>
    );
  }
)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #184d6d;

  background-color: transparent;
  border-radius: 250px;
  text-transform: uppercase;
  cursor: pointer;
  border: none;

  display: inline-flex;
  justify-content: center; /* center the content horizontally */
  align-items: center;

  &.text {
  }
  &.contained {
    color: white;
    background-color: #184d6d;
  }
  &.outlined {
    border: 1px solid #184d6d;
  }
  .start-icon {
    margin-right: 8px;
  }
  .end-icon {
    margin-left: 8px;
  }
  &.small {
    padding: 8px 16px;
  }
  &.medium {
    padding: 12px 24px;
  }
  &.large {
    padding: 20px 32px;
  }

  &.disabled {
    background-color: #a7a7a7;
    cursor: not-allowed;
  }
`;
