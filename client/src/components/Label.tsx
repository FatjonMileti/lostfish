import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: 'small' | 'medium';
  variant?: 'tertiary' | 'primary';
}

export const Label = styled(
  ({ className, active, size = 'medium', children, variant = 'primary', ...otherProps }: LabelProps) => {
    return (
      <div
        className={`label ${className} ${active ? 'active' : ''} size-${size} variant-${variant}`}
        {...otherProps}>
        {children}
      </div>
    );
  }
)`
  &.label {
    padding: 12px 8px;
    box-sizing: border-box;
    border-radius: 250px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    border: 2px solid transparent;
    font-family: Roobert, serif;
    cursor: pointer;
    color: #184d6d;

    display: flex;
    align-items: center;
    column-gap: 8px;

    //width: min-content;
    width: max-content;

    &.variant-tertiary {
      border: none;
      border-radius: 0;
      padding-inline: 0;
      border-bottom: 2px solid transparent;

      &:hover {
        color: #0d2a38;
        border: none;
        border-bottom: 2px solid #0d2a38;
      }

      &.size-small {
        font-size: 14px;
        line-height: 20px;
        height: 24px;
        padding: 0;
      }

      &.size-medium {
        height: 40px;
      }
    }

    &:hover {
      border: 2px solid #c0daff;
      color: #0d2a38;
    }
    &.active {
      background-color: #c0daff;
      color: #0d2a38;
    }
  }
`;
