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
    font-family: 'At Gambit', serif;
  }

  &.h2 {
    font-size: 56px;
    font-family: 'At Gambit', serif;
  }

  &.h3 {
    font-size: 48px;
    font-family: 'At Gambit', serif;
  }

  &.body1 {
    font-size: 40px;
    font-family: 'At Gambit', serif;
  }

  &.body2 {
    font-size: 32px;
    font-family: 'At Gambit', serif;
  }

  &.body3 {
    font-size: 24px;
    font-family: 'Roobert', serif;
  }

  &.body4 {
    font-size: 16px;
    line-height: 24px;
    font-family: 'Roobert', serif;
  }

  &.body5 {
    font-size: 14px;
    line-height: 20px;
    font-family: 'Roobert', serif;
  }

  &.menu {
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    text-transform: uppercase;
    color: #184d6d;
    font-family: 'Roobert', serif;
  }
`;
