import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CriteriaFormType, whenDoYouWantToMoveType, whenDoYouWantToMoveTypes } from '../criteria.types';

import { Label } from '../../../components/Label';
import { Typography } from '../../../components/Typography';
import { AreaOfInterest } from '../../Properties/AreaOfInterest';
import { Icon } from '../../../components/Icon';
import { Select } from '../../../components/Select/Select';

interface SetCriteriaLocationProps extends HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<CriteriaFormType>;
}

export const SetCriteriaLocation = styled(({ className, form }: SetCriteriaLocationProps) => {
  React.useEffect(() => {
    form.watch();
  }, []);

  return (
    <div className={className}>
      <div className='section property-location-section'>
        <Typography className='section-title' variant='body4'>
          Area preferences
        </Typography>
        <div className='section-content'>
          <AreaOfInterest
            startAdornment={
              <span style={{ padding: '13px 0 13px 13px' }}>
                <Icon icon='search' size={20} color='#CFD5D5' />
              </span>
            }
            placeholder='E.g. Bristol or BA1 2LR'
            label='Area of interest'
            areaOfInterest={form.getValues('areaOfInterest')}
            onAreaChange={({ formattedAddress, location }) => {
              form.setValue('areaOfInterest', formattedAddress);
              form.setValue('location', location);
            }}
          />
          <Select label='Radius' {...form.register('radius')}>
            <option></option>
            <option value='1'>1 mi</option>
            <option value='5'>5 mi</option>
            <option value='10'>10 mi</option>
            <option value='50'>50 mi</option>
          </Select>
        </div>
      </div>
      <div className='section moving-preferences-section'>
        <Typography className='section-title' variant='body4'>
          Move in preferences
        </Typography>
        <div className='section-content'>
          {whenDoYouWantToMoveTypes.map((when: whenDoYouWantToMoveType) => {
            const active = form.getValues('whenDoYouWantToMove') === when;
            return (
              <div key={when}>
                <Label active={active} onClick={() => form.setValue('whenDoYouWantToMove', when)}>
                  {when}
                  {active && (
                    <Icon
                      icon='close'
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue('whenDoYouWantToMove', undefined);
                      }}
                    />
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
})`
  & {
    display: grid;
    row-gap: 48px;
    .section {
      display: grid;
      row-gap: 16px;

      .section-title {
        color: #646464;
      }
    }

    .property-location-section {
      .section-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 24px;
      }
    }
    .moving-preferences-section {
      .section-content {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .label {
          padding: 16px 24px;
          align-items: center;
          display: flex;
          column-gap: 8px;
          user-select: none;
          border: 1px solid #cfd5d5;
          background: #fff;
          color: #0d2a38;
          font-weight: 600;
          height: 56px;

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
  }
`;
