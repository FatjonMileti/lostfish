import React from 'react';
import styled from '@emotion/styled';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = styled(({ className, children, ...rest }: LinkProps) => {
  return (
    <a className={className} {...rest}>
      {children}
    </a>
  );
})`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  cursor: pointer;
  text-transform: uppercase;
  color: #184d6d;
`;
