import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { PropertyPreferenceType, CriteriaFormType } from '../criteria.types';

import { Switch } from '../../../components/Switch';
import { Tab, Tabs } from '../../../components/Tab';
import { Typography } from '../../../components/Typography';
import { Select } from '../../../components/Select/Select';
import { HomeStyle, House, PropertyPreference, Transaction } from '../criteria.contants';
import {
  AreaUnit,
  BuildPurpose,
  Condition,
  Floor,
  OutsideSpace,
  Parking,
  PropertyType
} from '../../Properties/NewProperty/property.constants';
import { Slider } from '../../../components/Slider';
import { AreaUnitType } from '../../Properties/NewProperty/property.types';

interface SetCriteriaHouseTypeProps extends HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<CriteriaFormType>;
}

const toSquareMeter = (valueInSquareFt: number): number => {
  return Math.round(valueInSquareFt * 0.092903);
};

const toSquareFoot = (valueInSquareFt: number): number => {
  return Math.round(valueInSquareFt / 0.092903);
};

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
              value={Object.values(Transaction).indexOf(form.getValues('transactionType'))}
              onChange={(i: number) => {
                form.setValue(`transactionType`, Object.values(Transaction)[i]);
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
          {Object.values(PropertyType).map((propertyType, propertyTypeIndex) =>
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

      {!!form.getValues('propertyType.House') && (
        <div className='section house-details-section'>
          <Typography className='section-title' variant='body4'>
            House Details
          </Typography>
          <div className='section-content'>
            <Select label='Home style' {...form.register('houseDetails.homeStyle')}>
              <option></option>
              {Object.values(HomeStyle).map((style, styleIndex) => (
                <option value={style} key={styleIndex}>
                  {style}
                </option>
              ))}
            </Select>

            <Select label='Condition' {...form.register('houseDetails.condition')}>
              <option></option>
              {Object.values(Condition).map((style, styleIndex) => (
                <option value={style} key={styleIndex}>
                  {style}
                </option>
              ))}
            </Select>

            <Select label='Parking' {...form.register('houseDetails.parking')}>
              <option></option>
              {Object.values(Parking).map((pType, pTypeIndex) => (
                <option value={pType} key={pTypeIndex}>
                  {pType}
                </option>
              ))}
            </Select>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Preferred size
              </Typography>

              <div className='slider-unit-wrapper'>
                <Controller
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <Slider
                        value={[field?.value?.min, field?.value?.max]}
                        min={
                          form.getValues('houseDetails.preferredSize.unit') === AreaUnit.SquareFoot
                            ? 1000
                            : 100
                        }
                        max={
                          form.getValues('houseDetails.preferredSize.unit') === AreaUnit.SquareFoot
                            ? 10000
                            : 1000
                        }
                        step={1}
                        onChange={(_, value) => {
                          if (Array.isArray(value)) {
                            form.setValue('houseDetails.preferredSize.size', {
                              min: value[0],
                              max: value[1]
                            });
                          }
                        }}
                        valueLabelDisplay='on'
                        valueLabelFormat={(value) => value?.toLocaleString()}
                        size='small'
                      />
                    );
                  }}
                  name='houseDetails.preferredSize.size'
                />
                <Select
                  value={form.getValues('houseDetails.preferredSize.unit')}
                  onChange={(e) => {
                    const unit = e.target.value as AreaUnitType;
                    const size = form.getValues('houseDetails.preferredSize.size');

                    form.setValue('houseDetails.preferredSize.unit', unit);

                    const convertUnit = unit === AreaUnit.SquareFoot ? toSquareFoot : toSquareMeter;

                    form.setValue('houseDetails.preferredSize.size', {
                      min: convertUnit(size.min),
                      max: convertUnit(size.max)
                    });
                  }}>
                  {Object.values(AreaUnit).map((unit, unitIndex: number) => (
                    <option value={unit} key={unitIndex}>
                      {unit}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Garden
              </Typography>

              <div className='slider-unit-wrapper'>
                <Controller
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <Slider
                        value={[field?.value?.min, field?.value?.max]}
                        min={form.getValues('houseDetails.garden.unit') === AreaUnit.SquareFoot ? 200 : 20}
                        max={form.getValues('houseDetails.garden.unit') === AreaUnit.SquareFoot ? 1000 : 100}
                        step={1}
                        onChange={(_, value) => {
                          if (Array.isArray(value)) {
                            form.setValue('houseDetails.garden.size', {
                              min: value[0],
                              max: value[1]
                            });
                          }

                          // field.onChange({ target: { value: Array.isArray(value) ? value : [value] } });
                        }}
                        valueLabelDisplay='on'
                        valueLabelFormat={(value) => value?.toLocaleString()}
                        size='small'
                      />
                    );
                  }}
                  name='houseDetails.garden.size'
                />
                <Select
                  value={form.getValues('houseDetails.garden.unit')}
                  onChange={(e) => {
                    const unit = e.target.value as AreaUnitType;
                    const size = form.getValues('houseDetails.garden.size');
                    form.setValue('houseDetails.garden.unit', unit);

                    const convertUnit = unit === AreaUnit.SquareFoot ? toSquareFoot : toSquareMeter;

                    form.setValue('houseDetails.garden.size', {
                      min: convertUnit(size.min),
                      max: convertUnit(size.max)
                    });
                  }}>
                  {Object.values(AreaUnit).map((unit, unitIndex: number) => (
                    <option value={unit} key={unitIndex}>
                      {unit}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Storeys
              </Typography>
              <Slider
                value={[
                  form.getValues('houseDetails.storeys')?.min,
                  form.getValues('houseDetails.storeys')?.max
                ]}
                min={1}
                max={4}
                step={1}
                onChange={(_, value) => {
                  if (Array.isArray(value)) {
                    form.setValue('houseDetails.storeys', {
                      min: value[0],
                      max: value[1]
                    });
                  }
                }}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => value}
                size='small'
              />
            </div>

            {Object.values(House).map((houseType, houseTypeIndex) =>
              ((id: string) => (
                <div className='switch-wrapper' key={houseTypeIndex}>
                  <Switch
                    id={id}
                    size='medium'
                    {...form.register(`houseDetails.houseType.${houseType}`)}
                    checked={!!form.getValues('houseDetails.houseType')?.[houseType]}
                  />
                  <label htmlFor={id}>{houseType}</label>
                </div>
              ))(Date.now().toString())
            )}

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Bedrooms
              </Typography>
              <Slider
                value={[
                  form.getValues('houseDetails.nrOfBedrooms')?.min,
                  form.getValues('houseDetails.nrOfBedrooms')?.max
                ]}
                min={1}
                max={5}
                step={1}
                onChange={(_, value) => {
                  if (Array.isArray(value)) {
                    form.setValue('houseDetails.nrOfBedrooms', {
                      min: value[0],
                      max: value[1]
                    });
                  }
                }}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => value}
                size='small'
              />
            </div>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Bathrooms
              </Typography>
              <Slider
                value={[
                  form.getValues('houseDetails.nrOfBathrooms')?.min,
                  form.getValues('houseDetails.nrOfBathrooms')?.max
                ]}
                min={1}
                max={4}
                step={1}
                onChange={(_, value) => {
                  if (Array.isArray(value)) {
                    form.setValue('houseDetails.nrOfBathrooms', {
                      min: value[0],
                      max: value[1]
                    });
                  }
                }}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => value}
                size='small'
              />
            </div>
          </div>
        </div>
      )}

      {/*<div className='section property-type-section'>*/}
      {/*  <Typography className='section-title' variant='body4'>*/}
      {/*    Property Type*/}
      {/*  </Typography>*/}
      {/*  <div className='section-content'>*/}
      {/*    {Object.values(PropertyType).map((propertyType, propertyTypeIndex) =>*/}
      {/*      ((id: string) => (*/}
      {/*        <div className='switch-wrapper' key={propertyTypeIndex}>*/}
      {/*          <Switch*/}
      {/*            id={id}*/}
      {/*            size='medium'*/}
      {/*            {...form.register(`propertyType.${propertyType}`)}*/}
      {/*            checked={!!form.getValues('propertyType')[propertyType]}*/}
      {/*          />*/}
      {/*          <label htmlFor={id}>{propertyType}</label>*/}
      {/*        </div>*/}
      {/*      ))(React.useId())*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}
      {!!form.getValues('propertyType.Flats') && (
        <div className='section flat-details-section'>
          <Typography className='section-title' variant='body4'>
            Flat details
          </Typography>

          <div className='section-content'>
            <Select label='Flat style' {...form.register('flatDetails.propertyPurpose')}>
              <option></option>
              {Object.values(BuildPurpose).map((purpose, i) => (
                <option value={purpose} key={i}>
                  {purpose}
                </option>
              ))}
            </Select>

            <Select label='Preferred floor' {...form.register('flatDetails.preferredFloor')}>
              <option></option>
              {Object.values(Floor).map((pf, pfIndex) => (
                <option value={pf} key={pfIndex}>
                  {pf}
                </option>
              ))}
            </Select>

            <Select label='Condition' {...form.register('flatDetails.condition')}>
              <option></option>
              {Object.values(Condition).map((style, styleIndex) => (
                <option value={style} key={styleIndex}>
                  {style}
                </option>
              ))}
            </Select>

            {Object.values(OutsideSpace).map((space, spaceTypeIndex) =>
              ((id: string) => (
                <div className='switch-wrapper' key={spaceTypeIndex}>
                  <Switch
                    id={id}
                    size='medium'
                    {...form.register(`flatDetails.outsideSpace.${space}`)}
                    checked={!!form.getValues('flatDetails.outsideSpace')[space]}
                  />
                  <label htmlFor={id}>{space}</label>
                </div>
              ))(Date.now().toString())
            )}

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Preferred size
              </Typography>
              <div className='slider-unit-wrapper'>
                <Slider
                  value={[
                    form.getValues('flatDetails.preferredSize.size')?.min,
                    form.getValues('flatDetails.preferredSize.size')?.max
                  ]}
                  min={form.getValues('flatDetails.preferredSize.unit') === AreaUnit.SquareFoot ? 400 : 40}
                  max={form.getValues('flatDetails.preferredSize.unit') === AreaUnit.SquareFoot ? 4000 : 400}
                  step={1}
                  onChange={(_, value) => {
                    console.log('change', value);
                    if (Array.isArray(value)) {
                      form.setValue('flatDetails.preferredSize.size', {
                        min: value[0],
                        max: value[1]
                      });
                    }
                  }}
                  valueLabelDisplay='on'
                  valueLabelFormat={(value) => value?.toLocaleString()}
                  size='small'
                />

                <Select
                  value={form.getValues('flatDetails.preferredSize.unit')}
                  onChange={(e) => {
                    const unit = e.target.value as AreaUnitType;
                    const size = form.getValues('flatDetails.preferredSize.size');
                    form.setValue('flatDetails.preferredSize.unit', unit);

                    const convertUnit = unit === AreaUnit.SquareFoot ? toSquareFoot : toSquareMeter;

                    form.setValue('flatDetails.preferredSize.size', {
                      min: convertUnit(size.min),
                      max: convertUnit(size.max)
                    });
                  }}>
                  {Object.values(AreaUnit).map((unit, unitIndex: number) => (
                    <option value={unit} key={unitIndex}>
                      {unit}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Bedrooms
              </Typography>
              <Slider
                value={[
                  form.getValues('flatDetails.nrOfBedrooms')?.min,
                  form.getValues('flatDetails.nrOfBedrooms')?.max
                ]}
                min={1}
                max={5}
                step={1}
                onChange={(_, value) => {
                  if (Array.isArray(value)) {
                    form.setValue('flatDetails.nrOfBedrooms', {
                      min: value[0],
                      max: value[1]
                    });
                  }
                }}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => value}
                size='small'
              />
            </div>

            <div className='slider-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Bathrooms
              </Typography>
              <Slider
                value={[
                  form.getValues('flatDetails.nrOfBathrooms')?.min,
                  form.getValues('flatDetails.nrOfBathrooms')?.max
                ]}
                min={1}
                max={4}
                step={1}
                onChange={(_, value) => {
                  if (Array.isArray(value)) {
                    form.setValue('flatDetails.nrOfBathrooms', {
                      min: value[0],
                      max: value[1]
                    });
                  }
                }}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => value}
                size='small'
              />
            </div>

            {form.getValues('flatDetails.propertyPurpose') === BuildPurpose.PurposeBuilt && (
              <>
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='medium'
                      {...form.register('flatDetails.lift')}
                      checked={!!form.getValues('flatDetails.lift')}
                    />
                    <label htmlFor={id}>Lift</label>
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
                    <label htmlFor={id}>Security</label>
                  </div>
                ))(Date.now().toString())}
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='medium'
                      {...form.register('flatDetails.parkingSpace')}
                      checked={!!form.getValues('flatDetails.parkingSpace')}
                    />
                    <label htmlFor={id}>Parking space</label>
                  </div>
                ))(Date.now().toString())}
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='medium'
                      {...form.register('flatDetails.gymSpa')}
                      checked={!!form.getValues('flatDetails.gymSpa')}
                    />
                    <label htmlFor={id}>gym/spa</label>
                  </div>
                ))(Date.now().toString())}
              </>
            )}
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
              {Object.values(PropertyPreference).map(
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

    .house-details-section {
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

        .slider-wrapper {
          display: grid;
          row-gap: 4px;
          align-content: space-between;

          .slider-label {
            font-weight: 600;
          }

          .slider-unit-wrapper {
            display: grid;
            grid-template-columns: auto 70px;
            column-gap: 8px;
            align-items: flex-end;
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

        .slider-wrapper {
          display: grid;
          row-gap: 4px;
          align-content: space-between;

          .slider-label {
            font-weight: 600;
          }

          .slider-unit-wrapper {
            display: grid;
            grid-template-columns: auto 70px;
            column-gap: 8px;
            align-items: flex-end;
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
