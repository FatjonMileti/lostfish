import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../../components/Typography';
import { UseFormReturn } from 'react-hook-form';
import { BudgetForType, CriteriaFormType } from '../criteria.types';

import { Slider } from '../../../components/Slider';
import { TextField } from '../../../components/TextField';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import { Tab, Tabs } from '../../../components/Tab';
import { BudgetFor, ContractDetail, CreditScore } from '../criteria.contants';
import { Select } from '../../../components/Select/Select';

interface SetCriteriaBudgetProps extends HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<CriteriaFormType>;
}

export const SetCriteriaBudget = styled(({ className, form }: SetCriteriaBudgetProps) => {
  React.useEffect(() => {
    form.watch();
  }, []);

  return (
    <div className={className}>
      <div className='section budget-section'>
        <Typography className='section-title' variant='body4'>
          Budget (pcm)
        </Typography>

        <div className='section-content'>
          <div className='slider-wrapper'>
            <Typography variant='body6' className='slider-label'>
              Budget
            </Typography>
            <Slider
              className='budget-slider'
              value={form.getValues('idealBudget')}
              min={100}
              max={6000}
              step={100}
              onChange={(_, value) => {
                form.setValue('idealBudget', Array.isArray(value) ? value : [value]);
              }}
              valueLabelDisplay='on'
              valueLabelFormat={(value) => `£${value?.toLocaleString()}`}
              size='small'
            />
          </div>

          <Select label='Budget for:' {...form.register('nrOfBathrooms')}>
            {Object.values(BudgetFor).map((bf, bfIndex) => (
              <option key={bfIndex} value={bf}>
                {bf}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className='section deposit-details-section'>
        <Typography className='section-title' variant='body4'>
          Deposit information
        </Typography>
        <div className='section-content'>
          <TextField
            label='Deposit amount'
            startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
            type='number'
            {...form.register('depositAmount')}
          />
        </div>
      </div>

      <div className='section contract-details-section'>
        <Typography className='section-title' variant='body4'>
          Contract details
        </Typography>
        <div className='section-content'>
          {Object.values(ContractDetail).map((contractDetail, contractDetailIndex) => {
            const active = form.getValues('contractDetails')[contractDetail];
            return (
              <div key={contractDetailIndex}>
                <Label
                  active={active}
                  onClick={() => form.setValue(`contractDetails.${contractDetail}`, !active)}>
                  {contractDetail}
                  {active && <Icon icon='close' size={16} />}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div className='section credit-score-section'>
        <Typography className='section-title' variant='body4'>
          Credit score
        </Typography>
        <div className='section-content'>
          <Tabs
            value={Object.values(CreditScore).indexOf(form.getValues('creditScore'))}
            onChange={(i: number) => {
              form.setValue('creditScore', Object.values(CreditScore)[i]);
            }}
            rounded
            variant='tertiary'>
            <Tab label='Excellent' />
            <Tab label='Good' />
            <Tab label='Fair' />
          </Tabs>

          <div className='note'>
            <Typography>
              <span className='span-note'>Note:</span>{' '}
              <span className='underline-note'>Checking your credit report</span> with a CRA is free and
              doesn’t affect your credit score.
            </Typography>
          </div>
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

    .deposit-details-section {
      .section-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
        row-gap: 24px;
      }
    }

    .budget-section {
      .section-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 24px;

        .slider-wrapper {
          .slider-label {
            font-weight: 600;
          }

          .budget-slider {
            margin-top: 16px;
          }
        }
      }
    }

    .contract-details-section {
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
            background-color: #c0daff;
            border-color: #c0daff;
          }
        }
      }
    }

    .credit-score-section {
      .section-content {
        display: grid;
        row-gap: 24px;
        max-width: 441px;

        .tabs {
          width: 100%;
          background-color: white;
        }

        .note {
          display: flex;
          padding: 16px;
          align-items: flex-start;
          align-self: stretch;
          background-color: #f3f4f5;
          border-radius: 4px;

          .typography {
            color: #646464;
            font-family: Roobert, serif;
            font-size: 14px;
            font-style: normal;
            line-height: 20px;

            .span-note {
              font-weight: 700;
            }
            .underline-note {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
`;
