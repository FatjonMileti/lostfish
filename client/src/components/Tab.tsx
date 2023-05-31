import React, { MouseEventHandler, ReactElement } from 'react';
import { styled } from '@mui/system';
import { Typography } from './Typography';
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: ReactElement | ReactElement[];
  value?: any;
  onChange?: Function;
}

export const Tabs = styled(
  ({ className, children, value, onChange = (i: any) => {}, ...otherProps }: TabsProps) => {
    return (
      <div
        className={`tabs ${className}`}
        {...otherProps}
        style={{ gridTemplateColumns: `repeat(${React.Children.count(children)}, minmax(0, 1fr))` }}>
        {React.Children.map(children, (child: ReactElement, childIndex: number) => {
          if ((child.type as React.ComponentType).displayName === Tab.displayName) {
            return React.cloneElement(child, {
              active: childIndex === value,
              setActive: () => onChange(childIndex)
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
  border: 1px solid #e7e7e7;
  width: fit-content;
`;

export interface TabProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  active?: boolean;
  setActive?: MouseEventHandler;
}

export const Tab = styled(({ className, children, label, active, setActive, ...otherProps }: TabProps) => {
  return (
    <div className={`tab ${className} ${active ? 'active' : ''}`} {...otherProps} onClick={setActive}>
      <Typography className='label' variant='body4'>
        {label || null}
      </Typography>
    </div>
  );
})`
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
      background-color: #c0daff;
      .label {
        font-weight: 600;
      }
    }
  }
`;

Tab.displayName = 'Tab';
