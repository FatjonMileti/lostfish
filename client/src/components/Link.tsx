import React from 'react';
import { styled } from '@mui/system';
import { Typography } from './Typography';
import { TypographyProps } from './Typography';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: TypographyProps['variant'];
  underline?: 'always' | 'hover' | 'none';
}

export const Link = styled(
  ({ className, children, variant = 'menu', underline = 'hover', ...rest }: LinkProps) => {
    return (
      <a className={`link ${className} underline-${underline}`} {...rest}>
        <Typography variant={variant}>{children}</Typography>
      </a>
    );
  }
)`
  cursor: pointer;

  .typography {
    text-underline-offset: 8px;
    text-decoration-thickness: 1px;
    transition: text-decoration 2s;
    color: #184d6d;
  }

  &.underline-none {
    .typography {
      text-decoration: none;
    }
  }

  &.underline-hover {
    &:hover {
      .typography {
        text-decoration: underline;
      }
    }
  }

  &.underline-always {
    .typography {
      text-decoration: underline;
    }
  }
`;
