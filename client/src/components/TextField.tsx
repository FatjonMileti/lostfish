import { styled } from '@mui/system';
import React, { ReactElement } from 'react';

import { useId } from 'react';
import { Typography } from './Typography';
import { Icon } from './Icon';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'filled' | 'outlined' | 'standard';
  label?: string;
  required?: boolean;
  endAdornment?: ReactElement;
  startAdornment?: ReactElement;
  helperText?: string;
  error?: boolean;
}

export const TextField = styled(
  React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
      {
        className,
        id,
        label,
        type = 'text',
        required = false,
        endAdornment,
        startAdornment,
        helperText,
        error,
        variant = 'outlined',
        ...rest
      },
      ref
    ) => {
      const elementId = id || useId();
      return (
        <div className={`text-field ${className} ${error ? 'error' : ''} variant-${variant}`}>
          {(label || required) && (
            <label htmlFor={elementId}>
              {label}
              {required && <span className='required-asterisk'> *</span>}
            </label>
          )}

          <div className='input-wrapper'>
            {startAdornment || null}
            <input id={elementId} type={type} {...rest} ref={ref} />
            {endAdornment || null}
          </div>

          {helperText && (
            <span className='helper-text'>
              {error && <Icon icon='warning' size={12} color='#b4263b' />}
              <Typography variant='body4'>{helperText || ''}</Typography>
            </span>
          )}
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
        background-color: #ffffff;
      }

      input {
        width: 100%;
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
        &[type='password']:not(:placeholder-shown) {
          font-family: 'pass';
          font-weight: 400;
          font-size: larger;
        }
      }
    }

    &.variant-standard {
      .input-wrapper {
        border: none;

        border-bottom: 1px solid #a7a7a7;

        border-radius: 0;
      }
    }
  }
`;
