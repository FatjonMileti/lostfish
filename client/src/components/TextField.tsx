import styled from '@emotion/styled';
import React from 'react';

import { useId } from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: string;
  label?: string;
  required?: boolean;
}

export const TextField = styled(
  ({ className, id, label, type = 'text', required = false, ...rest }: TextFieldProps) => {
    const elementId = id || useId();
    return (
      <div className={className}>
        <label htmlFor={elementId}>
          {label}
          {required && <span className='required-asterisk'> *</span>}
        </label>
        <input id={elementId} type={type} {...rest} />
      </div>
    );
  }
)`
  display: flex;
  flex-direction: column;
  background-color: inherit;

  label {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #0d2a38;
  }

  .required-asterisk {
    color: #b4263b;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }

  input {
    margin-top: 4px;
    height: 48px;
    padding: 12px;
    box-sizing: border-box;

    border: 1px solid #a7a7a7;
    border-radius: 8px;
    background-color: inherit;
    outline: none;

    font-weight: 400;
    font-size: 14px;
    line-height: 24px;

    &:focus {
      border: 1px solid #184d6d;
    }
  }
`;
