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
import { Switch } from '../../components/Switch';
import { Select } from '../../components/Select/Select';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export type Step2FormType = {
  area: number[];
  nrOfBedrooms: number;
  nrOfBathrooms: number;
  specificPropertyFeatures: {
    'Parking spot': boolean;
    Garden: boolean;
    Terrace: boolean;
    'Fully furnished': boolean;
    'Partially furnished': boolean;
    Unfurnished: boolean;
    'Double glazing': boolean;
    'Allows smoking': boolean;
    'Allows pets': boolean;
    'Close to public transport': boolean;
  };
};

export const step2Schema: ObjectSchema<Step2FormType> = yup.object().shape({
  area: yup.array().required(),
  nrOfBedrooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bedrooms is required'),
  nrOfBathrooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bathroom is required'),
  specificPropertyFeatures: yup.object().shape({
    'Parking spot': yup.boolean().required(),
    Garden: yup.boolean().required(),
    Terrace: yup.boolean().required(),
    'Fully furnished': yup.boolean().required(),
    'Partially furnished': yup.boolean().required(),
    Unfurnished: yup.boolean().required(),
    'Double glazing': yup.boolean().required(),
    'Allows smoking': yup.boolean().required(),
    'Allows pets': yup.boolean().required(),
    'Close to public transport': yup.boolean().required()
  })
});

//Slider
function valuetext(value: number) {
  return `${value}`;
}
//--------//

export interface SetCriteriaStep2 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<any>;
  lookingFor: Step0FormType['lookingFor'];
  setCurrentStep: (currentStep: number) => void;
  criteriaId?: string;
}

export const SetCriteriaStep2 = styled(
  ({ className, closeModal, form, lookingFor, setCurrentStep, criteriaId }: SetCriteriaStep2) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    //Slider

    const [value, setValue] = React.useState<number[]>([80, 130]);

    const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
      form.setValue('area', value);
    };

    //--------//

    return (
      <div className={`set-criteria-step-2 ${className}`}>
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
                STEP 2/3
              </Typography>

              <Typography className='step-name' variant='body4'>
                Property preferences
              </Typography>

              <Typography variant='body5'>
                The more detailed your match requirements are the more perfect matches you are likely to get.
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add area preferences',
                  checked: !!form.getValues('area')
                },
                {
                  name: 'Add rooms preferences',
                  checked: !!form.getValues('nrOfBedrooms') && form.getValues('nrOfBathrooms')
                },
                {
                  name: 'Select features that you want to have',
                  checked: Object.values(form.getValues('specificPropertyFeatures')).includes(true)
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
                Area preferences
              </Typography>
              {/* ///////////Slider component////////// */}
              <div className='section-content'>
                <Box sx={{ width: 441 }}>
                  <Slider
                    value={value}
                    min={10}
                    max={150}
                    onChange={handleChange}
                    valueLabelDisplay='on'
                    valueLabelFormat={valuetext}
                  />
                </Box>
              </div>
            </div>
            <div className='section rooms-details-section'>
              <Typography className='section-title' variant='body4'>
                Rooms preferences
              </Typography>
              <div className='section-content'>
                <Select label='Bedrooms' {...form.register('nrOfBedrooms')}>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='5'>5</option>
                  <option value='10'>10</option>
                </Select>
                <Select label='Bathrooms' {...form.register('nrOfBathrooms')}>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                </Select>
              </div>
            </div>
            <div className='section specific-property-features-section'>
              <Typography className='section-title' variant='body4'>
                Specific property features
              </Typography>
              <div className='section-content'>
                {
                  <>
                    {[
                      'Parking spot',
                      'Garden',
                      'Terrace',
                      'Fully furnished',
                      'Partially furnished',
                      'Unfurnished',
                      'Double glazing',
                      'Allows smoking',
                      'Allows pets',
                      'Close to public transport'
                    ].map((specificPropertyFeature, specificPropertyFeatureIndex) =>
                      ((id: string) => (
                        <div className='switch-wrapper' key={specificPropertyFeatureIndex}>
                          <Switch
                            id={id}
                            size='small'
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
          </div>
        </div>

        <div className='footer'>
          <Button
            variant='secondary'
            size='large'
            startIcon={<Icon icon='arrow-left-1' size={12} />}
            onClick={() => setCurrentStep(1)}>
            back
          </Button>
          <Button
            // disabled={!form.formState.isValid}
            onClick={() => setCurrentStep(3)}
            size='large'
            endIcon={<Icon icon='arrow-right-1' size={12} />}>
            Next
          </Button>
        </div>
      </div>
    );
  }
)`
  &.set-criteria-step-2 {
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

          .what-im-looking-for {
            display: grid;
            row-gap: 8px;
            align-content: center;
            .choice {
              font-weight: 700;
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
          row-gap: 24px;

          .section-title {
            color: #646464;
          }

          &.area-details-section {
            .section-content {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              row-gap: 16px;
            }

            /////Slider Range//////

            .MuiSlider-root {
              color: #184d6d;
            }

            .css-nnid7-MuiSlider-valueLabel {
              color: #184d6d;
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

          &.specific-property-features-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
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

          &.property-images-section {
            .section-texts {
              display: grid;
              row-gap: 8px;
            }

            .section-content {
              display: grid;
              grid-template-columns: max-content min-content;
              gap: 24px;

              .images-list {
                display: flex;
                column-gap: 2px;
                flex-wrap: wrap;
                .image-wrapper {
                  border-radius: 4px;
                  height: 64px;
                  width: 96px;
                  position: relative;

                  .remove-button {
                    position: absolute;
                    color: white;
                    background-color: #e5155a;
                    padding: 3px;
                    right: 2px;
                    top: 2px;
                  }

                  img {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                  }
                }
              }

              .add-button {
                border: 2px solid #184d6d;
                padding: 22px;
                box-sizing: border-box;
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
