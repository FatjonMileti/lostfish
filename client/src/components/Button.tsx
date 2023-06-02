import React, { JSXElementConstructor, ReactElement } from 'react';
import { styled } from '@mui/system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'outlined' | 'primary' | 'secondary';
  startIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
  endIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
  size?: 'small' | 'medium' | 'large';
  inverted?: boolean;
  active?: boolean;
}

export const Button = styled(
  ({
    type = 'button',
    className = '',
    children,
    variant = 'primary',
    startIcon,
    endIcon,
    size = 'medium',
    disabled,
    inverted = false,
    active = false,
    ...rest
  }: ButtonProps) => {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`button ${className} variant-${variant} size-${size} ${inverted ? 'inverted' : ''} ${
          disabled ? 'disabled' : ''
        } ${active ? 'active' : ''}`}
        {...rest}>
        {startIcon && React.cloneElement(startIcon, { className: 'start-icon' })}
        {children}
        {endIcon && React.cloneElement(endIcon, { className: 'end-icon' })}
      </button>
    );
  }
)`
  font-family: Roobert;
  font-weight: 600;
  font-size: 16px;

  line-height: 24px;

  border-radius: 250px;

  cursor: pointer;
  border: none;

  display: inline-flex;
  justify-content: center; /* center the content horizontally */
  align-items: center;

  box-sizing: border-box;

  height: min-content;
  width: max-content;

  &.variant-outlined {
    border: 2px solid #184d6d;
    &:hover {
      background-color: #ffffff;
    }
  }

  //
  &.variant-primary {
    color: white;
    background-color: #184d6d;
    &:hover {
      background-color: #0d2a38;
    }

    &.active {
      background-color: #0d2a38;
    }

    &.disabled {
      background-color: #a7a7a7;
      cursor: not-allowed;
      &:hover {
        background-color: #a7a7a7;
      }
    }

    &.inverted {
      color: #0d2a38;
      background-color: #ffffff;
      &:hover {
        background-color: #c0daff;
      }

      &.active {
        background-color: #c0daff;
      }
    }
  }

  &.variant-secondary {
    border: 2px solid #184d6d;
    color: #184d6d;
    background-color: inherit;
    &:hover {
      color: #0d2a38;
      background-color: white;
    }

    &.active {
      color: #0d2a38;
      background-color: white;
    }

    &.disabled {
      color: #a7a7a7;
      cursor: not-allowed;
      border: 2px solid #a7a7a7;
    }

    &.inverted {
      color: white;
      border: 2px solid white;
      &:hover {
        color: #c0daff;
        border: 2px solid #c0daff;
      }

      &.active {
        color: #c0daff;
        border: 2px solid #c0daff;
      }
    }
  }
  //

  .start-icon {
    margin-right: 8px;
  }
  .end-icon {
    margin-left: 8px;
  }

  &.size-small {
    padding: 12px 24px;
    height: 48px;
  }
  &.size-medium {
    padding: 12px 32px;
    height: 48px;
  }
  &.size-large {
    padding: 20px 32px;
    font-size: 18px;
  }
`;
