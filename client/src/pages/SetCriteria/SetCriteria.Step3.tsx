import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Logo } from '../../components/Logo';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Step0FormType } from './SetCriteria.Step0';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import avatar from '../MyAccount/images/property.png';
import { Link } from '../../components/Link';
import { Select } from '../../components/Select/Select';
import { Tabs, Tab } from '../../components/Tab';

export type Step3FormType = {
  idealBudget: number;
  depositInformation: number;
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

export const step3Schema: ObjectSchema<Step3FormType> = yup.object().shape({
  idealBudget: yup.number().min(1).required('Property area is required'),
  depositInformation: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of bedrooms is required'),
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

export interface SetCriteriaStep3 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<any>;
  lookingFor: Step0FormType['lookingFor'];
  setCurrentStep: (currentStep: number) => void;
  criteriaId?: string;
  onDeleteClick: () => void;
}

export const SetCriteriaStep3 = styled(
  ({
    className,
    closeModal,
    form,
    lookingFor,
    setCurrentStep,
    criteriaId,
    onDeleteClick
  }: SetCriteriaStep3) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    const [activeTab, setActiveTab] = React.useState(0);

    return (
      <div className={`set-criteria-step-2 ${className}`}>
        <div className='header'>
          <Logo />
          <div className='right-side'>
            {criteriaId && (
              <Button
                className='delete-button'
                startIcon={<Icon icon='trash' size={20} />}
                onClick={onDeleteClick}>
                Delete property
              </Button>
            )}
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
                  checked: !!form.getValues('depositInformation')
                },
                {
                  name: 'Add parameters bellow your ideal credit score'
                  //   checked: Object.values(form.getValues('specificPropertyFeatures')).includes(true)
                },
                {
                  name: 'Add more contact details'
                  //  checked: Object.values(form.getValues('specificPropertyFeatures')).includes(true)
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
              <div className='section-content'>
                {/* <TextField
                  label='Property area (in sqm)'
                  {...form.register('area')}
                  error={!!form.formState.errors.area}
                  helperText={form.formState.errors.area?.message?.toString()}
                  type='number'
                /> */}
                <Typography className='section-title' variant='body4'>
                  ///////////Slider component//////////
                </Typography>
              </div>
            </div>
            <div className='section rooms-details-section'>
              <Typography className='section-title' variant='body4'>
                Deposit information
              </Typography>
              <div className='section-content'>
                <Select label='Months payed in advance'>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='5'>2</option>
                  <option value='10'>5</option>
                  <option value='50'>10</option>
                </Select>
              </div>
            </div>
            <div className='section specific-property-features-section'>
              <Typography className='section-title' variant='body4'>
                Credit score
              </Typography>
              <div className='section-content'>
                <Tabs value={activeTab} onChange={(i: number) => setActiveTab(i)}>
                  <Tab label='Excellent' />
                  <Tab label='Good' />
                  <Tab label='Fair' />
                </Tabs>
              </div>
              <div className='note'>
                <Typography>
                  Note: Checking your credit report with a CRA is free and doesn’t affect your credit score.
                </Typography>
              </div>
            </div>
            <div className='section specific-property-features-section'>
              <Typography className='section-title' variant='body4'>
                Contact details
              </Typography>
              <div className='section-content'>
                <Button size='large' variant='primary' inverted>
                  Guarantor
                </Button>
                <Button size='large' variant='primary' inverted>
                  Reviewed property
                </Button>
                <Button size='large' variant='primary' inverted>
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
          <Button size='large' endIcon={<Icon icon='arrow-right-1' size={12} />} disabled>
            Start matching
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
        .delete-button {
          color: #e5155a;
          background-color: white;
          border: none;
          .icon {
            color: #e5155a;
          }
        }
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
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 24px;
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
