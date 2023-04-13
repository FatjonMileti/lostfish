import React from 'react';
import styled from '@emotion/styled';
import { Typography } from './Typography';
import { TypographyProps } from './Typography';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: TypographyProps['variant'];
}

export const Link = styled(({ className, children, variant = 'menu', ...rest }: LinkProps) => {
  return (
    <a className={`link ${className}`} {...rest}>
      <Typography variant={variant}>{children}</Typography>
    </a>
  );
})`
  cursor: pointer;
`;
