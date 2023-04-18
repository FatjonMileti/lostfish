import styled from '@emotion/styled';
import React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = styled(({ className, ...otherProps }: SwitchProps) => {
  return <input className={`switch ${className}`} type='checkbox' {...otherProps} />;
})`
  & {
    position: relative;
    width: 0;
    height: 0;
    cursor: pointer;

    &:checked {
      &:after {
        left: 16px;
        background-color: #0d2a38;
      }
      &:before {
        background-color: #c0daff;
      }
    }

    &:after {
      position: absolute;
      content: '';
      width: 24px;
      height: 24px;
      background-color: #a7a7a7;
      border-radius: 50%;
      left: 0;
      top: -12px;
      transition: 0.4s;
    }

    &:before {
      position: absolute;
      content: '';
      width: 40px;
      height: 16px;
      background-color: #cfd5d5;
      border-radius: 8px;
      left: 0;
      top: -8px;
    }
  }
`;
