import React from 'react';
import styled from '@emotion/styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'contained' | 'outlined';
}

export const Button = styled(({ className, children, variant = 'text', ...rest }: ButtonProps) => {
  return (
    <button className={`button ${className} ${variant}`} {...rest}>
      {children}
    </button>
  );
})`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #184d6d;

  background-color: transparent;
  border-radius: 250px;
  padding: 12px 24px;
  text-transform: uppercase;

  cursor: pointer;

  border: none;

  &.text {
  }

  &.contained {
    color: white;
    background-color: #184d6d;
  }

  &.outlined {
    border: 1px solid #184d6d;
  }
`;
