import React from 'react';
import styled from '@emotion/styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = styled(({ className, children, ...rest }: ButtonProps) => {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
})`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #184d6d;

  background-color: white;

  border: 1px solid #184d6d;
  border-radius: 250px;
  padding: 12px 24px;
  text-transform: uppercase;

  cursor: pointer;
`;
