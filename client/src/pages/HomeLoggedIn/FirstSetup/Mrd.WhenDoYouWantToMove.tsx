import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { HTMLAttributes } from 'react';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';

export interface WhenDoYouWantToMoveProps extends HTMLAttributes<HTMLDivElement> {
  onWhenChange: (when: string) => void;
  value?: string;
}
export const WhenDoYouWantToMove = styled(({ className, onWhenChange, value }: WhenDoYouWantToMoveProps) => {
  return (
    <div className={className}>
      <Typography variant='body2'>When do you want to move in?</Typography>

      <div className='options-container'>
        {[
          'Today',
          'This week',
          'As soon as possible',
          'This month',
          'I’m not in a rush',
          'I want to take my time'
        ].map((when: string) => (
          <div key={when}>
            {/* <label>{when}</label> */}
            {/* <Radio value={when} onClick={() => onWhenChange('Today')} /> */}
            <Label active={value === when} onClick={() => onWhenChange(when)}>
              {when}
              {value === when && (
                <Icon
                  icon='close'
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    onWhenChange('');
                  }}
                />
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
})`
  & {
    display: grid;
    justify-items: center;
    row-gap: 32px;
    .options-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .label {
        border-width: 1px;
        padding: 16px 24px;
        border-color: #cfd5d5;

        align-items: center;
        display: flex;
        column-gap: 8px;

        user-select: none;

        :hover {
          border: 1px solid #eee0d3;
        }

        &.active {
          background-color: #eee0d3;
          border-color: #eee0d3;
        }
      }
    }
  }
`;
