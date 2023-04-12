import React from 'react';
import styled from '@emotion/styled';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'h1' | 'h2' | 'h3' | 'menu';
}

export const Typography = styled(
  ({ className, children, variant = 'body1', ...otherProps }: TypographyProps) => {
    return (
      <p className={`typography ${className} ${variant}`} {...otherProps}>
        {children}
      </p>
    );
  }
)`
  margin: 0;

  &.h1 {
    font-size: 64px;
    line-height: 72px;
  }

  &.h2 {
    font-size: 56px;
  }

  &.h3 {
    font-size: 48px;
  }

  &.body1 {
    font-size: 40px;
  }

  &.body2 {
    font-size: 32px;
  }

  &.body3 {
    font-size: 24px;
  }

  &.body4 {
    font-size: 16px;
    line-height: 24px;
  }

  &.body5 {
    font-size: 14px;
  }

  &.menu {
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    text-transform: uppercase;
    color: #184d6d;
  }
`;
