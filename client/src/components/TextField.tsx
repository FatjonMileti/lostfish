import styled from '@emotion/styled';
import React, { ReactElement } from 'react';

import { useId } from 'react';
import { Typography } from './Typography';
import { Icon } from './Icon';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: string;
  label?: string;
  required?: boolean;
  endAdornment?: ReactElement;
  helperText?: string;
  error?: boolean;
}

export const TextField = styled(
  React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
      { className, id, label, type = 'text', required = false, endAdornment, helperText, error, ...rest },
      ref
    ) => {
      const elementId = id || useId();
      return (
        <div className={`text-field ${className} ${error ? 'error' : ''}`}>
          <label htmlFor={elementId}>
            {label}
            {required && <span className='required-asterisk'> *</span>}
          </label>

          <div className='input-wrapper'>
            <input id={elementId} type={type} {...rest} ref={ref} />
            {endAdornment ? endAdornment : null}
          </div>

          <span className='helper-text'>
            {error && <Icon icon='warning' size={12} color='#b4263b' />}
            <Typography variant='body4'>{helperText || ' '}</Typography>
          </span>
        </div>
      );
    }
  )
)`
  &.text-field {
    display: flex;
    flex-direction: column;
    background-color: inherit;
    row-gap: 4px;

    font-family: 'Roobert', serif;

    label {
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      color: #0d2a38;

      .required-asterisk {
        color: #b4263b;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
      }
    }

    .helper-text {
      color: #b4263b;
      display: flex;
      column-gap: 10px;
      align-items: center;

      .typography {
        font-size: 12px;
        line-height: 16px;
        min-height: 16px;
        font-weight: 600;
      }
    }

    &.error {
      .input-wrapper {
        border: 1px solid #b4263b;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;

      border: 1px solid #a7a7a7;
      border-radius: 8px;
      background-color: inherit;

      &:focus-within {
        border: 1px solid #184d6d;
      }

      input {
        height: 48px;
        padding: 12px;
        box-sizing: border-box;

        border: none;
        border-radius: inherit;
        outline: none;
        background-color: inherit;

        font-weight: 400;
        font-size: 14px;
        line-height: 24px;

        flex-grow: 1;
      }
    }
  }
`;
