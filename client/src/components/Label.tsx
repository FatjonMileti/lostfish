import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import classNames from 'classnames';

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary';
  special?: boolean;
  inverted?: boolean;
  disabled?: boolean;
}

export const Label = styled(
  ({
    className,
    active,
    size = 'medium',
    children,
    variant = 'primary',
    special = false,
    inverted = false,
    disabled = false,
    ...otherProps
  }: LabelProps) => {
    return (
      <div
        className={classNames(className, 'label', `size-${size}`, `variant-${variant}`, {
          active,
          inverted,
          disabled,
          special
        })}
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

    justify-content: center;

    &.variant-primary {
      border: 1px solid #184d6d;
      background: #184d6d;
      color: white;

      &:hover {
        color: white;
        border: 1px solid #0d2a38;
        background-color: #0d2a38;
      }

      &.disabled {
        border: 1px solid #a7a7a7;
        background: #a7a7a7;
        color: white;
        cursor: not-allowed;
      }

      &.special {
        color: white;
        background: #e5155a;
        border: 1px solid #e5155a;
        &:hover {
          color: white;
          border: 1px solid #b4263b;
          background: #b4263b;
        }

        &.disabled {
          border: 1px solid #a7a7a7;
          background: #a7a7a7;
          color: white;
          cursor: not-allowed;
        }
      }

      &.size-medium {
        height: 48px;
        padding: 12px 20px;
        font-size: 16px;
        line-height: 24px;
      }

      &.size-large {
        padding: 20px 32px;
        height: 64px;
        font-size: 18px;
        line-height: 24px;
        font-weight: 600;
      }
    }

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

      &.active {
        color: #184d6d;
        background-color: unset;
        border-bottom: 2px solid #184d6d;

        &:hover {
          color: #0d2a38;
          border: none;
          border-bottom: 2px solid #0d2a38;
        }
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

    &.variant-secondary {
      border: 2px solid #184d6d;
      height: fit-content;

      &:hover {
        color: #0d2a38;
        border: 2px solid #0d2a38;
        background-color: rgba(24, 77, 109, 0.1);
      }

      &.inverted {
        border: 2px solid white;
        color: white;
        &:hover {
          color: #0d2a38;
          border-bottom: 2px solid white;
          background-color: white;
        }
      }

      &.size-medium {
        height: 48px;
        padding: 12px 20px;
        font-size: 16px;
        line-height: 24px;
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
