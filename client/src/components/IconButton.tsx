import React from 'react';
import styled from '@emotion/styled';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const IconButton = styled(({ className, children, ...rest }: IconButtonProps) => {
  return (
    <button className={`icon-button ${className}`} {...rest}>
      {children}
    </button>
  );
})`
  font-weight: 600;
  font-size: 16px;

  color: #184d6d;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;

  border: 1px solid #184d6d;
`;
