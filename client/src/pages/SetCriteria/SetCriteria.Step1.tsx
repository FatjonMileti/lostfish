import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Step0FormType } from './SetCriteria.Step0';
import { Logo } from '../../components/Logo';
import { IconButton } from '../../components/IconButton';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Typography } from '../../components/Typography';
import avatar from '../MyAccount/images/property.png';
import { Link } from '../../components/Link';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select/Select';
import { Switch } from '../../components/Switch';
import { Tabs, Tab } from '../../components/Tab';

export type Step1FormType = {
  areaOfInterest: string;
  radius?: number;
  propertyType: {
    Detached: boolean;
    'Semi-Detached': boolean;
    Terraced: boolean;
    Flats: boolean;
    Bungalows: boolean;
    'Farms/Land': boolean;
    'Park homes': boolean;
  };
  // propertyClass?: string;
  propertyClass: {
    'New home': boolean;
    'Retirement home': boolean;
    'Shared ownership': boolean;
    Auction: boolean;
    //////////////// propertyFeatures////////////
    'Parks nearby': boolean;
    'Public transport nearby': boolean;
    'Shopping centers nearby': boolean;
  };
};

export const step1Schema: ObjectSchema<Step1FormType> = yup.object().shape({
  areaOfInterest: yup.string().required(),
  radius: yup.number().optional(),
  propertyType: yup.object().shape({
    Detached: yup.boolean().required(),
    'Semi-Detached': yup.boolean().required(),
    Terraced: yup.boolean().required(),
    Flats: yup.boolean().required(),
    Bungalows: yup.boolean().required(),
    'Farms/Land': yup.boolean().required(),
    'Park homes': yup.boolean().required()
  }),
  propertyClass: yup.object().shape({
    'New home': yup.boolean().required(),
    'Retirement home': yup.boolean().required(),
    'Shared ownership': yup.boolean().required(),
    Auction: yup.boolean().required(),
    /////////////// propertyFeatures///////////
    'Parks nearby': yup.boolean().required(),
    'Public transport nearby': yup.boolean().required(),
    'Shopping centers nearby': yup.boolean().required()
  })
});

export interface SetCriteriaStep1 extends Omit<HTMLProps<HTMLDivElement>, 'form'> {
  closeModal: () => void;
  form: UseFormReturn<Step1FormType>;
  lookingFor: Step0FormType['lookingFor'];
  setCurrentStep: (currentStep: number) => void;
  criteriaId?: string;
}

type PropertyClassType = {
  'New home': boolean;
  'Retirement home': boolean;
  'Shared ownership': boolean;
  Auction: boolean;
  /////////////// propertyFeatures///////////
  'Parks nearby': boolean;
  'Public transport nearby': boolean;
  'Shopping centers nearby': boolean;
};

export const SetCriteriaStep1 = styled(
  ({ className, closeModal, form, lookingFor, setCurrentStep, criteriaId }: SetCriteriaStep1) => {
    React.useEffect(() => {
      form.watch();
    }, []);

    const [activeTab, setActiveTab] = React.useState<PropertyClassType>({
      'New home': true,
      'Retirement home': true,
      'Shared ownership': true,
      Auction: true,
      /////////////// propertyFeatures///////////
      'Parks nearby': true,
      'Public transport nearby': true,
      'Shopping centers nearby': true
    });

    const initialValue: PropertyClassType = {
      'New home': true,
      'Retirement home': true,
      'Shared ownership': true,
      Auction: true,
      /////////////// propertyFeatures///////////
      'Parks nearby': true,
      'Public transport nearby': true,
      'Shopping centers nearby': true
    };

    const handleTabChange = (propertyPreference: keyof PropertyClassType, i: number) => {
      const updatedActiveTab = {
        ...activeTab,
        [propertyPreference]: i === 0
      };
      setActiveTab(updatedActiveTab);

      const updatedValue: PropertyClassType = {
        ...activeTab,
        [propertyPreference]: i === 0 ? true : false
      };

      form.setValue('propertyClass', updatedValue);
    };

    React.useEffect(() => {
      form.setValue('propertyClass', initialValue);
    }, []);

    return (
      <div className={`set-criteria-step-1 ${className}`}>
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
                STEP 1/3
              </Typography>
              <Typography className='step-name' variant='body4'>
                Location preferences
              </Typography>

              <Typography variant='body5'>
                The more detailed your match requirements are the more perfect matches you are likely to get.
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add at last one area of interest',
                  checked: !!form.getValues('areaOfInterest')
                },
                {
                  name: 'Add a flexible search radius for more accurate results',
                  checked: !!form.getValues('radius')
                },
                {
                  name: 'Select the type of property you are looking for',
                  checked: Object.values(form.getValues('propertyType')).includes(true)
                },
                {
                  name: ' Include or exclude property class',
                  checked: Object.values(activeTab).some((value) => value)
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
            <div className='section property-location-section'>
              <Typography className='section-title' variant='body4'>
                Where do you want to rent?
              </Typography>
              <div className='section-content'>
                <TextField
                  startAdornment={
                    <span style={{ padding: '13px 0 13px 13px' }}>
                      <Icon icon='search' size={20} color='#CFD5D5' />
                    </span>
                  }
                  placeholder='E.g. Bristol or BA1 2LR'
                  label='Area of interest'
                  {...form.register('areaOfInterest')}
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
            <div className='section property-type-section'>
              <Typography className='section-title' variant='body4'>
                Property Type
              </Typography>
              <div className='section-content'>
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Detached')}
                      checked={!!form.getValues('propertyType').Detached}
                    />
                    <label htmlFor={id}>Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Semi-Detached')}
                      checked={!!form.getValues('propertyType')['Semi-Detached']}
                    />
                    <label htmlFor={id}>Semi-Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Terraced')}
                      checked={!!form.getValues('propertyType').Terraced}
                    />
                    <label htmlFor={id}>Terraced</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Flats')}
                      checked={!!form.getValues('propertyType').Flats}
                    />
                    <label htmlFor={id}>Flats</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Bungalows')}
                      checked={!!form.getValues('propertyType').Bungalows}
                    />
                    <label htmlFor={id}>Bungalows</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Park homes')}
                      checked={!!form.getValues('propertyType')['Park homes']}
                    />
                    <label htmlFor={id}>Park homes</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      {...form.register('propertyType.Farms/Land')}
                      checked={!!form.getValues('propertyType')['Farms/Land']}
                    />
                    <label htmlFor={id}>Farms/Land</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>
            <div className='section property-preferences-section'>
              <Typography className='section-title' variant='body4'>
                Property class
              </Typography>
              <div className='section-content'>
                <Controller
                  render={({ field }) => (
                    <>
                      {['New home', 'Retirement home', 'Shared ownership', 'Auction'].map(
                        (propertyPreference: string, propertyPreferenceIndex) => (
                          <div className='tabs-wrapper' key={propertyPreferenceIndex}>
                            <label htmlFor={propertyPreference}>{propertyPreference}:</label>
                            <Tabs
                              value={activeTab[propertyPreference as keyof PropertyClassType] ? 0 : 1}
                              onChange={(i: number) =>
                                handleTabChange(propertyPreference as keyof PropertyClassType, i)
                              }>
                              <Tab label='Include' />
                              <Tab label='Exclude' />
                            </Tabs>
                          </div>
                        )
                      )}
                    </>
                  )}
                  name='propertyClass'
                  control={form.control}
                />
              </div>
            </div>
            <div className='section property-preferences-section'>
              <Typography className='section-title' variant='body4'>
                Features
              </Typography>
              <div className='section-content'>
                <Controller
                  render={({ field }) => (
                    <>
                      {['Parks nearby', 'Public transport nearby', 'Shopping centers nearby'].map(
                        (propertyPreference: string, propertyPreferenceIndex) =>
                          ((id: string) => (
                            <div className='tabs-wrapper' key={propertyPreferenceIndex}>
                              <label htmlFor={id}>{propertyPreference}:</label>
                              <Tabs
                                value={activeTab[propertyPreference as keyof PropertyClassType] ? 0 : 1}
                                onChange={(i: number) =>
                                  handleTabChange(propertyPreference as keyof PropertyClassType, i)
                                }>
                                <Tab label='Include' />
                                <Tab label='Exclude' />
                              </Tabs>
                            </div>
                          ))(React.useId())
                      )}
                    </>
                  )}
                  name='propertyClass'
                  control={form.control}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='footer'>
          <Button
            size='large'
            endIcon={<Icon icon='arrow-right-1' size={12} />}
            onClick={() => setCurrentStep(2)}>
            Next
          </Button>
        </div>
      </div>
    );
  }
)`
  &.set-criteria-step-1 {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto min-content;

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

          &.property-location-section {
            .section-content {
              display: grid;
              grid-template-columns: 2fr 1fr 1fr;
              column-gap: 24px;
            }
          }

          &.property-type-section,
          &.property-preferences-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 24px;
              row-gap: 24px;
              //////
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
                .active {
                  background-color: #c0daff;
                }
              }
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

          &.features-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 16px;
            }
          }
        }
      }
    }

    .footer {
      padding: 20px 36px;
      display: grid;
      justify-content: flex-end;
    }
  }
`;
