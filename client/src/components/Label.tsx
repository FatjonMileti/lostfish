import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: 'small' | 'medium';
}

export const Label = styled(({ className, active, size = 'medium', children, ...otherProps }: LabelProps) => {
  return (
    <div className={`label ${className} ${active ? 'active' : ''} size-${size}`} {...otherProps}>
      {children}
    </div>
  );
})`
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

    &:hover {
      border: 2px solid #c0daff;
      color: #0d2a38;
    }
    &.active {
      background-color: #c0daff;
      color: #0d2a38;
    }

    &.size-small {
      font-size: 14px;
      line-height: 20px;
    }
  }
`;
