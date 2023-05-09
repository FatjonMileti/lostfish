import React from 'react';
import { styled } from '@mui/system';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {}

export const Card = styled(({ className, children, ...otherProps }: CardProps) => {
  return (
    <div className={`card ${className}`} {...otherProps}>
      {children}
    </div>
  );
})`
  border-radius: 24px;
  padding: 32px;
  box-sizing: border-box;
`;
