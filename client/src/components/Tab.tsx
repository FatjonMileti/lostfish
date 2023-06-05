import React, { MouseEventHandler, ReactElement } from 'react';
import { styled } from '@mui/system';
import { Typography } from './Typography';
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: ReactElement | ReactElement[];
  value?: any;
  onChange?: Function;
  variant?: 'primary' | 'secondary';
}

export const Tabs = styled(
  ({
    className,
    children,
    value,
    onChange = (i: any) => {},
    variant = 'primary',
    ...otherProps
  }: TabsProps) => {
    return (
      <div
        className={`tabs ${className} ${variant ? `variant-${variant}` : ''}`}
        {...otherProps}
        style={{ gridTemplateColumns: `repeat(${React.Children.count(children)}, minmax(0, 1fr))` }}>
        {React.Children.map(children, (child: ReactElement, childIndex: number) => {
          if ((child.type as React.ComponentType).displayName === Tab.displayName) {
            return React.cloneElement(child, {
              active: childIndex === value,
              setActive: () => onChange(childIndex),
              variant
            });
          }
          return null;
        })}
      </div>
    );
  }
)`
  display: grid;
  border-radius: 10px;
  column-gap: 4px;
  padding: 4px;
  box-sizing: border-box;
  width: fit-content;

  &.variant-primary {
    border: 1px solid #0d2a38;
  }

  &.variant-secondary {
    border: 1px solid #e7e7e7;
  }
`;

export interface TabProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  active?: boolean;
  setActive?: MouseEventHandler;
  variant?: 'primary' | 'secondary';
}

export const Tab = styled(
  ({ className, children, label, active, setActive, variant = 'primary', ...otherProps }: TabProps) => {
    return (
      <div
        className={`tab ${className} ${active ? 'active' : ''} ${variant ? `variant-${variant}` : ''}`}
        {...otherProps}
        onClick={setActive}>
        <Typography className='label' variant='body4'>
          {label || null}
        </Typography>
      </div>
    );
  }
)`
  &.tab {
    user-select: none;
    cursor: pointer;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    justify-content: center;
    flex-grow: 1;
    box-sizing: border-box;
    .label {
      font-weight: 400;
    }

    &.active {
      .label {
        font-weight: 600;
      }
    }

    &.variant-primary {
      &.active {
        background-color: #0d2a38;
        .label {
          color: white;
        }
      }
    }

    &.variant-secondary {
      &.active {
        background-color: #c0daff;
        .label {
          font-weight: 600;
        }
      }
    }
  }
`;

Tab.displayName = 'Tab';
