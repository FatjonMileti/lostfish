import React from 'react';
import styled from '@emotion/styled';
import { Typography } from './Typography';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = styled(({ className, children, ...rest }: LinkProps) => {
  return (
    <a className={className} {...rest}>
      <Typography variant='menu'>{children}</Typography>
    </a>
  );
})`
  cursor: pointer;
`;
