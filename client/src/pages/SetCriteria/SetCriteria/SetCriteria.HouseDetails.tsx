import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CriteriaFormType } from '../criteria.types';

import { Slider } from '../../../components/Slider';
import { Select } from '../../../components/Select/Select';
import { Switch } from '../../../components/Switch';
import { Typography } from '../../../components/Typography';
import { SpecificPropertyFeature } from '../criteria.contants';
import { AreaUnit, Parking } from '../../Properties/NewProperties/property.constants';

interface SetCriteriaHouseDetailsProps extends HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<CriteriaFormType>;
}

export const SetCriteriaHouseDetails = styled(({ className, form }: SetCriteriaHouseDetailsProps) => {
  React.useEffect(() => {
    form.watch();
  }, []);

  return (
    <div className={className}>
      <div className='section area-details-section'>
        <Typography className='section-title' variant='body4'>
          Area preferences
        </Typography>
        <div className='section-content'>
          <div className='slider-wrapper'>
            <div className='label-wrapper'>
              <Typography variant='body6' className='slider-label'>
                Property area (in {form.getValues('areaUnit')})
              </Typography>
              {((id: string) => (
                <div className='switch-wrapper'>
                  <Switch
                    id={id}
                    size='small'
                    checked={form.getValues('areaUnit') === AreaUnit.SquareFoot}
                    onChange={({ target: { checked } }) =>
                      form.setValue('areaUnit', checked ? AreaUnit.SquareFoot : AreaUnit.SquareMeter)
                    }
                  />
                  <label htmlFor={id}>use sq.ft</label>
                </div>
              ))(React.useId())}
            </div>

            <Slider
              value={form.getValues('area')}
              min={10}
              max={1000}
              step={10}
              onChange={(_, value) => form.setValue('area', Array.isArray(value) ? value : [value])}
              valueLabelDisplay='on'
              valueLabelFormat={(value) => value}
              size='small'
            />
          </div>
        </div>
      </div>
      <div className='section rooms-details-section'>
        <Typography className='section-title' variant='body4'>
          Rooms preferences
        </Typography>
        <div className='section-content'>
          <div className='slider-wrapper'>
            <Typography variant='body6' className='slider-label'>
              Bedrooms
            </Typography>
            <Slider
              value={form.getValues('nrOfBedrooms')}
              min={0}
              max={5}
              step={1}
              onChange={(_, value) => form.setValue('nrOfBedrooms', Array.isArray(value) ? value : [value])}
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
              value={form.getValues('nrOfBathrooms')}
              min={0}
              max={4}
              step={1}
              onChange={(_, value) => form.setValue('nrOfBathrooms', Array.isArray(value) ? value : [value])}
              valueLabelDisplay='on'
              valueLabelFormat={(value) => value}
              size='small'
            />
          </div>

          {/*<Select label='Bathrooms' {...form.register('nrOfBathrooms')}>*/}
          {/*  <option></option>*/}
          {/*  <option value='1'>1</option>*/}
          {/*  <option value='2'>2</option>*/}
          {/*  <option value='3'>3</option>*/}
          {/*  <option value='4'>4</option>*/}
          {/*</Select>*/}
        </div>
      </div>
      <div className='section specific-property-features-section'>
        <Typography className='section-title' variant='body4'>
          Specific property features
        </Typography>
        <div className='section-content'>
          {
            <>
              {Object.values(SpecificPropertyFeature).map(
                (specificPropertyFeature, specificPropertyFeatureIndex: number) =>
                  ((id: string) => (
                    <div className='switch-wrapper' key={specificPropertyFeatureIndex}>
                      <Switch
                        id={id}
                        size='medium'
                        {...form.register(`specificPropertyFeatures.${specificPropertyFeature}`)}
                        checked={!!form.getValues('specificPropertyFeatures')[specificPropertyFeature]}
                      />
                      <label htmlFor={id}>{specificPropertyFeature}</label>
                    </div>
                  ))(React.useId())
              )}
            </>
          }
        </div>
      </div>
      {form.getValues('specificPropertyFeatures')[SpecificPropertyFeature.ParkingSpot] && (
        <div className='section specific-property-features-section'>
          <Typography className='section-title' variant='body4'>
            Parking type
          </Typography>
          <div className='section-content'>
            {
              <>
                {Object.values(Parking).map((pt, ptIndex: number) =>
                  ((id: string) => (
                    <div className='switch-wrapper' key={ptIndex}>
                      <Switch
                        id={id}
                        size='medium'
                        {...form.register(`parkingType.${pt}`)}
                        checked={!!form.getValues('parkingType')[pt]}
                      />
                      <label htmlFor={id}>{pt}</label>
                    </div>
                  ))(Date.now().toString())
                )}
              </>
            }
          </div>
        </div>
      )}
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

      &.area-details-section {
        .section-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          column-gap: 24px;

          .slider-wrapper {
            display: grid;
            row-gap: 32px;

            .label-wrapper {
              display: flex;
              column-gap: 16px;

              .switch-wrapper {
                column-gap: 8px;
                display: flex;
                align-items: center;
                font-size: 12px;
                line-height: 16px;
                font-family: 'Roobert', serif;
                font-weight: 600;
              }
            }

            .slider-label {
              font-weight: 600;
            }
          }
        }
      }

      &.rooms-details-section {
        .section-content {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          column-gap: 24px;
          row-gap: 24px;
          align-items: center;

          .slider-wrapper {
            display: grid;
            row-gap: 32px;

            .slider-label {
              font-weight: 600;
            }
          }
        }
      }

      &.specific-property-features-section {
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
    }
  }
`;
