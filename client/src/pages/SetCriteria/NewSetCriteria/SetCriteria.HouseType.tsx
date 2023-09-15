import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  PropertyPreferenceType,
  propertyPreferences,
  propertyTypes,
  CriteriaFormType,
  transactionTypes,
  BuildPurpose
} from '../criteria.types';

import { Switch } from '../../../components/Switch';
import { Tab, Tabs } from '../../../components/Tab';
import { Typography } from '../../../components/Typography';
import { Select } from '../../../components/Select/Select';

interface SetCriteriaHouseTypeProps extends HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<CriteriaFormType>;
}

export const SetCriteriaHouseType = styled(({ className, form }: SetCriteriaHouseTypeProps) => {
  React.useEffect(() => {
    form.watch();
  }, []);

  return (
    <div className={className}>
      <div className='section transaction-type-section'>
        <Typography className='section-title' variant='body4'>
          What are you looking for?
        </Typography>
        <div className='section-content'>
          <div className='tabs-wrapper'>
            <Tabs
              variant='tertiary'
              rounded
              value={transactionTypes.indexOf(form.getValues('transactionType'))}
              onChange={(i: number) => {
                form.setValue(`transactionType`, transactionTypes[i]);
              }}>
              <Tab label='I’m looking to rent a place' />
              <Tab label='I’m looking to buy a place' disabled />
            </Tabs>
          </div>
        </div>
      </div>

      <div className='section property-type-section'>
        <Typography className='section-title' variant='body4'>
          Property Type
        </Typography>
        <div className='section-content'>
          {propertyTypes.map((propertyType, propertyTypeIndex) =>
            ((id: string) => (
              <div className='switch-wrapper' key={propertyTypeIndex}>
                <Switch
                  id={id}
                  size='medium'
                  {...form.register(`propertyType.${propertyType}`)}
                  checked={!!form.getValues('propertyType')[propertyType]}
                />
                <label htmlFor={id}>{propertyType}</label>
              </div>
            ))(React.useId())
          )}
        </div>
      </div>
      {!!form.getValues('propertyType.Flats') && (
        <div className='section flat-details-section'>
          <Typography className='section-title' variant='body4'>
            Flat details
          </Typography>

          <div className='section-content'>
            <Select label='Build Purpose' {...form.register('flatDetails.propertyPurpose')}>
              <option></option>
              {Object.values(BuildPurpose).map((purpose, i) => (
                <option value={purpose} key={i}>
                  {purpose}
                </option>
              ))}
            </Select>

            {((id: string) => (
              <div className='switch-wrapper'>
                <Switch
                  id={id}
                  size='medium'
                  {...form.register('flatDetails.lift')}
                  checked={!!form.getValues('flatDetails.lift')}
                />
                <label htmlFor={id}>lift</label>
              </div>
            ))(Date.now().toString())}
            {((id: string) => (
              <div className='switch-wrapper'>
                <Switch
                  id={id}
                  size='medium'
                  {...form.register('flatDetails.security')}
                  checked={!!form.getValues('flatDetails.security')}
                />
                <label htmlFor={id}>security</label>
              </div>
            ))(Date.now().toString())}

            <Select label='Floor' {...form.register('flatDetails.floor')}>
              <option></option>
              {Array.from({ length: 21 }, (_, i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}
      <div className='section property-class-section'>
        <Typography className='section-title' variant='body4'>
          Property class
        </Typography>
        <div className='section-content'>
          {
            <>
              {propertyPreferences.map(
                (propertyPreference: PropertyPreferenceType, propertyPreferenceIndex: number) =>
                  ((id: string) => (
                    <div className='tabs-wrapper' key={propertyPreferenceIndex}>
                      <label htmlFor={id}>{propertyPreference}:</label>
                      <Tabs
                        id={id}
                        variant='tertiary'
                        rounded
                        value={form.getValues('propertyClass')[propertyPreference] ? 0 : 1}
                        onChange={(i: number) => {
                          form.setValue(`propertyClass.${propertyPreference}`, !i);
                        }}>
                        <Tab label='Include' />
                        <Tab label='Exclude' />
                      </Tabs>
                    </div>
                  ))(React.useId())
              )}
            </>
          }
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

    .transaction-type-section {
      .section-content {
        .tabs-wrapper {
          display: flex;
          align-items: flex-start;

          label {
            color: #000;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Roobert', serif;
          }

          .tabs {
            column-gap: 0;
            .tab {
              padding: 12px 24px;
            }
          }
        }
      }
    }

    .property-type-section {
      .section-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
        row-gap: 24px;

        .switch-wrapper {
          display: flex;
          column-gap: 8px;
          align-items: center;
          label {
            color: #0d2a38;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            font-family: 'Roobert', serif;
          }
        }
      }
    }

    .flat-details-section {
      .section-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
        row-gap: 24px;

        .switch-wrapper {
          display: flex;
          column-gap: 8px;
          align-items: center;
          label {
            color: #0d2a38;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            font-family: 'Roobert', serif;
          }
        }

        .tabs-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 8px;
          align-items: flex-start;

          label {
            color: #000;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Roobert', serif;
          }

          .tabs {
            column-gap: 0;

            .tab {
              padding: 12px 24px;
              width: 148px;
            }
          }
        }
      }
    }

    .property-class-section {
      .section-content {
        display: grid;
        grid-template-columns: max-content max-content;
        row-gap: 24px;
        justify-content: space-between;

        .tabs-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 8px;
          align-items: flex-start;

          label {
            color: #000;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Roobert', serif;
          }

          .tabs {
            column-gap: 0;

            .tab {
              padding: 12px 24px;
              width: 148px;
            }
          }
        }
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
