import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Logo } from '../../components/Logo';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { UseFormReturn } from 'react-hook-form';
import { Step0FormType } from './SetCriteria.Step0';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import avatar from '../MyAccount/images/property.png';
import { Link } from '../../components/Link';
import { TextField } from '../../components/TextField';
import { Tabs, Tab } from '../../components/Tab';
import Slider from '@mui/material/Slider';

export type Step3FormType = {
  idealBudget: number[];
  depositAmount?: number;
  creditScore: string;
  contractDetails: {
    Guarantor: boolean;
    'Reviewed Property': boolean;
    'Energy Certificate': boolean;
  };
};

export const step3Schema: ObjectSchema<Step3FormType> = yup.object().shape({
  idealBudget: yup.array().required(),
  depositAmount: yup
    .number()
    .min(0, 'Must be greater then or equal to 0')
    .transform((value) => (isNaN(value) ? undefined : value))
    .optional(),
  creditScore: yup.string().required(),
  contractDetails: yup.object().shape({
    Guarantor: yup.boolean().required(),
    'Reviewed Property': yup.boolean().required(),
    'Energy Certificate': yup.boolean().required()
  })
});

type ButtonType = 'Guarantor' | 'Reviewed Property' | 'Energy Certificate';

//Slider
function valuetext(value: number) {
  return `£${value}`;
}
//--------//

export interface SetCriteriaStep3 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<any>;
  lookingFor: Step0FormType['lookingFor'];
  setCurrentStep: (currentStep: number) => void;
  criteriaId?: string;
  handleSubmit: () => void;
}

export const SetCriteriaStep3 = styled(
  ({
    className,
    closeModal,
    form,
    lookingFor,
    setCurrentStep,
    criteriaId,
    handleSubmit
  }: SetCriteriaStep3) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    return (
      <div className={`set-criteria-step-3 ${className}`}>
        <div className='header'>
          <Logo />
          <div className='right-side'>
            <IconButton size='large' noBackground onClick={closeModal}>
              <Icon icon='close' size={12} />
            </IconButton>
          </div>
        </div>
        <div className='content'>
          <div className='content-left'>
            <Typography variant='body2'>Your current search</Typography>

            <div className='looking-for-section'>
              <div className='intersection'>
                <div className='match-avatar-intersection'>
                  <img alt='avatar' src={avatar} className='avatar' />

                  <div className='match-thumbnail'>
                    <Icon size={20} icon={'key'} color='white' />
                  </div>
                </div>
              </div>
              <div className='what-im-looking-for'>
                <Typography className='choice' variant='body4'>
                  {{ Rent: 'I’m looking to rent a place', Sale: 'I’m looking to buy a place' }[lookingFor]}
                </Typography>
                <Link onClick={() => setCurrentStep(0)}>Change</Link>
              </div>
            </div>

            <div className='step-details'>
              <Typography variant='body4' className='step-number'>
                STEP 3/3
              </Typography>

              <Typography className='step-name' variant='body4'>
                Budget preferences
              </Typography>

              <Typography variant='body5'>
                The more detailed your match requirements are the more perfect matches you are likely to get.
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add parameters bellow your ideal budget',
                  checked: !!form.getValues('idealBudget')
                },
                {
                  name: 'Add deposit information',
                  checked: !!form.getValues('depositAmount')
                },
                {
                  name: 'Add parameters bellow your ideal credit score',
                  checked: !!form.getValues('creditScore')
                },
                {
                  name: 'Add more contact details',
                  checked: !!form.getValues('contractDetails')
                }
              ].map((progressItem, progressItemIndex) => (
                <div
                  className={`progress-item ${progressItem.checked ? 'active' : ''}`}
                  key={progressItemIndex}>
                  <div className='progress-item-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4' className='progress-item-text'>
                    {progressItem.name}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          <div className='line' />

          <div className='content-right'>
            <div className='section area-details-section'>
              <Typography className='section-title' variant='body4'>
                Budget (pcm)
              </Typography>
              {/* ///////////Slider component////////// */}
              <div className='section-content'>
                <div style={{ width: 441 }}>
                  <Slider
                    value={form.getValues('idealBudget')}
                    min={100}
                    max={6000}
                    step={100}
                    onChange={(_, value) => form.setValue('idealBudget', value)}
                    valueLabelDisplay='on'
                    valueLabelFormat={valuetext}
                  />
                </div>
              </div>
            </div>
            <div className='section rooms-details-section'>
              <Typography className='section-title' variant='body4'>
                Deposit details
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
            <div className='section credit-score'>
              <Typography className='section-title' variant='body4'>
                Credit score
              </Typography>
              <div className='tabs-wrapper'>
                <Tabs
                  value={['Excellent', 'Good', 'Fair'].indexOf(form.getValues('creditScore'))}
                  onChange={(i: number) => {
                    form.setValue('creditScore', ['Excellent', 'Good', 'Fair'][i]);
                  }}>
                  <Tab label='Excellent' />
                  <Tab label='Good' />
                  <Tab label='Fair' />
                </Tabs>
              </div>
              <div className='note'>
                <Typography>
                  <span className='span-note'>Note:</span>{' '}
                  <span className='underline-note'>Checking your credit report</span> with a CRA is free and
                  doesn’t affect your credit score.
                </Typography>
              </div>
            </div>
            <div className='credit-details'>
              <Typography className='section-title' variant='body4'>
                Contract details
              </Typography>
              <div className='section-content'>
                <Button
                  size='large'
                  variant='primary'
                  endIcon={
                    form.getValues('contractDetails').Guarantor ? (
                      <Icon icon='close' size={16} />
                    ) : (
                      <Icon icon='plus' size={16} />
                    )
                  }
                  inverted
                  className={`${form.getValues('contractDetails').Guarantor ? 'active' : ''}`}
                  onClick={() => {
                    const contractDetails = form.getValues(
                      'contractDetails'
                    ) as Step3FormType['contractDetails'];
                    const updatedContractDetails = {
                      ...contractDetails,
                      Guarantor: !contractDetails.Guarantor
                    };
                    form.setValue('contractDetails', updatedContractDetails);
                  }}>
                  Guarantor
                </Button>
                <Button
                  size='large'
                  variant='primary'
                  endIcon={
                    form.getValues('contractDetails')['Reviewed Property'] ? (
                      <Icon icon='close' size={16} />
                    ) : (
                      <Icon icon='plus' size={16} />
                    )
                  }
                  inverted
                  className={`${form.getValues('contractDetails')['Reviewed Property'] ? 'active' : ''}`}
                  onClick={() => {
                    const contractDetails = form.getValues(
                      'contractDetails'
                    ) as Step3FormType['contractDetails'];
                    const updatedContractDetails = {
                      ...contractDetails,
                      'Reviewed Property': !contractDetails['Reviewed Property']
                    };
                    form.setValue('contractDetails', updatedContractDetails);
                  }}>
                  Reviewed property
                </Button>
                <Button
                  size='large'
                  variant='primary'
                  endIcon={
                    form.getValues('contractDetails')['Energy Certificate'] ? (
                      <Icon icon='close' size={16} />
                    ) : (
                      <Icon icon='plus' size={16} />
                    )
                  }
                  inverted
                  className={`${form.getValues('contractDetails')['Energy Certificate'] ? 'active' : ''}`}
                  onClick={() => {
                    const contractDetails = form.getValues(
                      'contractDetails'
                    ) as Step3FormType['contractDetails'];
                    const updatedContractDetails = {
                      ...contractDetails,
                      'Energy Certificate': !contractDetails['Energy Certificate']
                    };
                    form.setValue('contractDetails', updatedContractDetails);
                  }}>
                  Energy certificate
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button
            variant='secondary'
            size='large'
            startIcon={<Icon icon='arrow-left-1' size={12} />}
            onClick={() => setCurrentStep(2)}>
            back
          </Button>
          <Button size='large' endIcon={<Icon icon='arrow-right-1' size={12} />} onClick={handleSubmit}>
            Start matching
          </Button>
        </div>
      </div>
    );
  }
)`
  &.set-criteria-step-3 {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto min-content;
    overflow-y: auto;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 36px;

      .right-side {
        display: flex;
        column-gap: 32px;
      }
    }

    .content {
      display: grid;
      grid-template-columns: 1fr min-content 2.79fr;
      column-gap: 69px;
      padding: 36px;

      .content-left {
        display: grid;
        row-gap: 32px;
        align-content: flex-start;

        .looking-for-section {
          display: flex;
          column-gap: 16px;

          .match-avatar-intersection {
            display: flex;
            position: relative;

            .avatar {
              margin-right: -20px;
              overflow: hidden;
              width: 64px;
              height: 64px;
              border-radius: 50%;
              align-items: center;
              justify-content: center;
              background-color: #eee0d3;
              z-index: 1;
            }

            .match-thumbnail {
              border-radius: 50%;
              background-color: #184d6d;
              padding: 22px;
              position: relative;
              overflow: hidden;
              width: 64px;
              height: 64px;
              box-sizing: border-box;

              :after {
                background-color: #ffffff;
                clip-path: circle(50% at -19% 50%);
                width: 100%;
                height: 100%;
                content: '';
                position: absolute;
                inset: 0;
                z-index: 1;
              }
            }
          }
        }

        .step-details {
          display: grid;
          row-gap: 8px;
          .step-name {
            font-weight: 600;
          }

          .step-number {
            color: #c4b1a3;
            font-weight: 700;
          }
        }

        .sections-progress-list {
          display: grid;
          row-gap: 16px;
          .progress-item {
            display: flex;
            column-gap: 8px;

            .progress-item-indicator {
              border-radius: 50%;
              background-color: #cfd5d5;
              color: #cfd5d5;
              padding: 7px;
              width: 24px;
              height: 24px;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .progress-item-text {
              color: #a7a7a7;
            }

            &.active {
              .progress-item-indicator {
                background-color: #184d6d;
              }
              .progress-item-text {
                color: black;
              }
            }
          }
        }
      }

      .line {
        width: 2px;
        background-color: #f3f4f5;
      }

      .content-right {
        display: grid;
        row-gap: 32px;
        align-content: flex-start;
        .section {
          display: grid;
          row-gap: 16px;

          .section-title {
            color: #646464;
          }

          /////Slider Range//////

         &.area-details-section {
              .MuiSlider-root {
                color: #184D6D;
              }

            .css-nnid7-MuiSlider-valueLabel {
              color: #184D6D;
              background-color: #fff;
              padding: 0px;
            }
          }

          &.rooms-details-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 24px;
              row-gap: 24px;
            }
          }
          
          &.credit-score {
            .tabs-wrapper {
              display: flex;
              padding: 4px;
              align-items: flex-start;

              .tabs {
                border: 1px solid #E7E7E7;
              }

              .active {
                  background-color: #c0daff;
                }
            }

            width: 441px; 

            .active {
                  background-color: #c0daff;
                }
              
            .note {
              display: flex;
              padding: 12px;
              align-items: flex-start;
              align-self: stretch;
              background-color: #F3F4F5;
              border-radius: 8px; 

              .typography {
                color:  #646464;
                font-family: Roobert;
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
        /////
        .credit-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;

          .section-title {
            color: #646464;
          }
          
          .section-content {
              display: flex;
              align-items: center;
              column-gap: 12px;

              .button {
                padding: 12px;
                border-radius: 250px;
                border: 2px solid #C0DAFF;
                gap: 8px;
                
                .icon {
                  border-radius: 50%;
                  background-color: white;
                  padding: 4px;
                }
              }
          }
        }
      }
    }
  }

    .footer {
      padding: 20px 36px;
      display: grid;
      justify-content: space-between;
      grid-template-columns: min-content min-content;
    }
  }
`;
