import { styled } from '@mui/system';
import React, { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Logo } from '../../components/Logo';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Switch } from '../../components/Switch';
import { Link } from '../../components/Link';
import avatar from '../MyAccount/images/avatar1.svg';
import { PropertyService } from './NewProperty';
import { Radio } from '../../components/Radio';
import { Select } from '../../components/Select/Select';

export interface NewPropertyStep3props extends HTMLProps<HTMLDivElement> {
  closeModal: () => void;
  saveAsDraft: () => void;
  propertyService: PropertyService;
}

export const NewPropertyStep3 = styled(
  ({ className, closeModal, saveAsDraft, propertyService }: NewPropertyStep3props) => {
    console.log(propertyService.state);
    return (
      <div className={`new-property-step-3 ${className}`}>
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
                  {['I’m looking for a tenant', 'I’m looking for a buyer'][propertyService.state.lookingFor]}
                </Typography>
                <Link onClick={() => propertyService.setCurrentStep(0)}>Change</Link>
              </div>
            </div>

            <div className='step-details'>
              <Typography className='step-name' variant='body4'>
                Property details
              </Typography>

              <Typography variant='body5'>
                The more detailed your match requirements are the more perfect matches you are likely to get.
              </Typography>

              <Typography variant='body4' className='step-number'>
                STEP 3/3
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add renting price',
                  checked: !!propertyService.state.rentingPrice
                },
                {
                  name: 'Add deposit details',
                  checked: !!propertyService.state.monthsPayedInAdvance
                },
                {
                  name: 'Add credit score requirements',
                  checked: !!propertyService.state.creditScoreRequirements
                },
                {
                  name: 'Add contract details',
                  checked: Object.values(propertyService.state.contractDetails).includes(true)
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
            <div className='section renting-price-section'>
              <Typography className='section-title' variant='body4'>
                Renting price
              </Typography>
              <div className='section-content'>
                <TextField
                  label='Add renting price'
                  required
                  value={propertyService.state.rentingPrice}
                  onChange={({ target: { value } }) => propertyService.setRentingPrice(value)}
                  startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                />
                <TextField
                  label='Promotional price (optional)'
                  value={propertyService.state.promotionalPrice}
                  onChange={({ target: { value } }) => propertyService.setPromotionalPrice(value)}
                  startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                />
                <Select
                  label='Payment Frequency'
                  value={propertyService.state.paymentFrequency}
                  onChange={({ target: { value } }) => propertyService.setPaymentFrequency(value)}>
                  <option></option>
                  <option value='Day'>Day</option>
                  <option value='Week'>Week</option>
                  <option value='2week'>2week</option>
                  <option value='4week'>4week</option>
                  <option value='Month'>Month</option>
                  <option value='Year'></option>
                </Select>
              </div>
            </div>

            <div className='section months-payed-in-advance-section'>
              <Typography className='section-title' variant='body4'>
                Deposit details
              </Typography>
              <div className='section-content'>
                <Select
                  label='Months payed in advance'
                  required
                  value={propertyService.state.monthsPayedInAdvance}
                  onChange={({ target: { value } }) => propertyService.setMonthsPayedInAdvance(value)}>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                </Select>
              </div>
            </div>

            <div className='section credit-score-requirements-section'>
              <Typography className='section-title' variant='body4'>
                Credit score requirements
              </Typography>
              <div className='section-content'>
                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='Excellent'
                      checked={propertyService.state.creditScoreRequirements === 'Excellent'}
                      onChange={(e) => propertyService.setCreditScoreRequirements(e.target.value)}
                    />
                    <label htmlFor={id}>Parking spot</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='Good'
                      checked={propertyService.state.creditScoreRequirements === 'Good'}
                      onChange={(e) => propertyService.setCreditScoreRequirements(e.target.value)}
                    />
                    <label htmlFor={id}>Parking spot</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='radio-wrapper'>
                    <Radio
                      id={id}
                      value='Fair'
                      checked={propertyService.state.creditScoreRequirements === 'Fair'}
                      onChange={(e) => propertyService.setCreditScoreRequirements(e.target.value)}
                    />
                    <label htmlFor={id}>Parking spot</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>

            <div className='section contract-details-section'>
              <Typography className='section-title' variant='body4'>
                Contract details
              </Typography>

              <div className='section-content'>
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setContractDetails({
                          ...propertyService.state.contractDetails,
                          guarantor: !propertyService.state.contractDetails.guarantor
                        })
                      }
                      checked={propertyService.state.contractDetails.guarantor}
                    />
                    <label htmlFor={id}>Guarantor</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setContractDetails({
                          ...propertyService.state.contractDetails,
                          reviewedProperty: !propertyService.state.contractDetails.reviewedProperty
                        })
                      }
                      checked={propertyService.state.contractDetails.reviewedProperty}
                    />
                    <label htmlFor={id}>Reviewed property</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setContractDetails({
                          ...propertyService.state.contractDetails,
                          energyCertificate: !propertyService.state.contractDetails.energyCertificate
                        })
                      }
                      checked={propertyService.state.contractDetails.energyCertificate}
                    />
                    <label htmlFor={id}>Energy certificate</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button
            variant='secondary'
            size='large'
            startIcon={<Icon icon='arrow-left-1' size={12} />}
            onClick={() => propertyService.setCurrentStep(2)}>
            back
          </Button>
          <Button size='large' endIcon={<Icon icon='arrow-right-1' size={12} />}>
            Start matching
          </Button>
        </div>
      </div>
    );
  }
)`
  &.new-property-step-3 {
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

          &.renting-price-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 24px;
            }
          }

          &.months-payed-in-advance-section {
            .section-content {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              column-gap: 24px;
              row-gap: 24px;
            }
          }

          &.credit-score-requirements-section {
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

          &.contract-details-section {
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
