import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Logo } from '../../components/Logo';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select/Select';
import { Switch } from '../../components/Switch';
import { Link } from '../../components/Link';
import avatar from '../MyAccount/images/avatar1.svg';
import { Radio } from '../../components/Radio';
import { NewPropertyStateType } from './NewProperty';

export interface NewPropertyStep1props extends HTMLProps<HTMLDivElement> {
  closeModal: () => void;
  saveAsDraft: () => void;
  setCurrentStep: (i: number) => void;
  lookingFor: number;

  areaOfInterest: NewPropertyStateType['areaOfInterest'];
  setAreaOfInterest: (areaOfInterest: NewPropertyStateType['areaOfInterest']) => void;

  radius: NewPropertyStateType['radius'];
  setRadius: (radius: NewPropertyStateType['radius']) => void;

  propertyType: null | string;
  setPropertyType: (i: string) => void;
  setPropertyPreferences: (i: string) => void;
  propertyPreferences: null | string;
  propertyFeatures: NewPropertyStateType['propertyFeatures'];
  setPropertyFeatures: (i: NewPropertyStateType['propertyFeatures']) => void;
}
export const NewPropertyStep1 = styled(
  ({
    className,
    closeModal,
    saveAsDraft,
    setCurrentStep,
    lookingFor,

    areaOfInterest,
    setAreaOfInterest,

    radius,
    setRadius,

    propertyType,
    setPropertyType,
    setPropertyPreferences,
    propertyPreferences,
    propertyFeatures,
    setPropertyFeatures
  }: NewPropertyStep1props) => {
    return (
      <div className={`new-property-step-1 ${className}`}>
        <div className='header'>
          <Logo />
          <div className='right-side'>
            <Button variant='secondary' onClick={saveAsDraft}>
              Save as draft
            </Button>
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
                  {['I’m looking for a tenant', 'I’m looking for a buyer'][lookingFor]}
                </Typography>
                <Link onClick={() => setCurrentStep(0)}>Change</Link>
              </div>
            </div>

            <div className='step-details'>
              <Typography className='step-name' variant='body4'>
                Location details
              </Typography>

              <Typography variant='body5'>
                The more detailed your match requirements are the more perfect matches you are likely to get.
              </Typography>

              <Typography variant='body4' className='step-number'>
                STEP 1/3
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add the location of your property',
                  checked: !!areaOfInterest
                },
                {
                  name: 'Add the radius close to nearest city',
                  checked: !!radius
                },
                {
                  name: 'Add your property type',
                  checked: !!propertyType
                },
                {
                  name: ' Include or exclude property preferences',
                  checked: !!propertyPreferences
                },
                {
                  name: 'Add property features',
                  checked: Object.values(propertyFeatures).includes(true)
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
                Property location
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
                  value={areaOfInterest}
                  onChange={({ target: { value } }) => setAreaOfInterest(value)}
                />
                <Select label='Radius' value={radius} onChange={({ target: { value } }) => setRadius(value)}>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                </Select>
              </div>
            </div>

            <div className='section property-type-section'>
              <Typography className='section-title' variant='body4'>
                Property Type
              </Typography>
              <div className='section-content'>
                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='1'
                      checked={propertyType === '1'}
                      onChange={() => setPropertyType('1')}
                    />
                    <label htmlFor={id}>Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='2'
                      checked={propertyType === '2'}
                      onChange={() => setPropertyType('2')}
                    />
                    <label htmlFor={id}>Semi- Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='3'
                      checked={propertyType === '3'}
                      onChange={() => setPropertyType('3')}
                    />
                    <label htmlFor={id}>Terraced</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='4'
                      checked={propertyType === '4'}
                      onChange={() => setPropertyType('4')}
                    />
                    <label htmlFor={id}>Flats</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='5'
                      checked={propertyType === '5'}
                      onChange={(e) => setPropertyType(e.target.value)}
                    />
                    <label htmlFor={id}>Bungalows</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='6'
                      checked={propertyType === '6'}
                      onChange={(e) => setPropertyType(e.target.value)}
                    />
                    <label htmlFor={id}>Park homes</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='7'
                      checked={propertyType === '7'}
                      onChange={(e) => setPropertyType(e.target.value)}
                    />
                    <label htmlFor={id}>Farms/Land</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>

            <div className='section property-preferences-section'>
              <Typography className='section-title' variant='body4'>
                Property preferences
              </Typography>
              <div className='section-content'>
                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='1'
                      checked={propertyPreferences === '1'}
                      onChange={() => setPropertyPreferences('1')}
                    />
                    <label htmlFor={id}>Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='2'
                      checked={propertyPreferences === '2'}
                      onChange={() => setPropertyPreferences('2')}
                    />
                    <label htmlFor={id}>Semi- Detached</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='3'
                      checked={propertyPreferences === '3'}
                      onChange={() => setPropertyPreferences('3')}
                    />
                    <label htmlFor={id}>Terraced</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='4'
                      checked={propertyPreferences === '4'}
                      onChange={() => setPropertyPreferences('4')}
                    />
                    <label htmlFor={id}>Flats</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>

            <div className='section features-section'>
              <Typography className='section-title' variant='body4'>
                Property features
              </Typography>

              <div className='section-content'>
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        setPropertyFeatures({
                          ...propertyFeatures,
                          parksNearBy: !propertyFeatures.parksNearBy
                        })
                      }
                      checked={propertyFeatures.parksNearBy}
                    />
                    <label htmlFor={id}>Parks nearby</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        setPropertyFeatures({
                          ...propertyFeatures,
                          publicTransportNearby: !propertyFeatures.publicTransportNearby
                        })
                      }
                      checked={propertyFeatures.publicTransportNearby}
                    />
                    <label htmlFor={id}>Public transport nearby</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        setPropertyFeatures({
                          ...propertyFeatures,
                          shoppingCentersNearby: !propertyFeatures.shoppingCentersNearby
                        })
                      }
                      checked={propertyFeatures.shoppingCentersNearby}
                    />
                    <label htmlFor={id}>Shopping centers nearby</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button size='large' endIcon={<Icon icon='arrow-right-1' size={12} />}>
            Next
          </Button>
        </div>
      </div>
    );
  }
)`
  &.new-property-step-1 {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto min-content;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;

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

              .radio-wrapper {
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
    }

    .footer {
      padding: 20px 36px;
      display: grid;
      justify-content: flex-end;
    }
  }
`;
