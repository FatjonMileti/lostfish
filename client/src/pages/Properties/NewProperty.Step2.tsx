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
import { Upload } from '../../components/Upload';

export interface NewPropertyStep2props extends HTMLProps<HTMLDivElement> {
  closeModal: () => void;
  saveAsDraft: () => void;
  propertyService: PropertyService;
}

export const NewPropertyStep2 = styled(
  ({ className, closeModal, saveAsDraft, propertyService }: NewPropertyStep2props) => {
    console.log(propertyService.state);
    return (
      <div className={`new-property-step-2 ${className}`}>
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
                STEP 2/3
              </Typography>
            </div>

            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add area details',
                  checked: !!propertyService.state.area
                },
                {
                  name: 'Add rooms details',
                  checked: !!propertyService.state.nrOfBedrooms && propertyService.state.nrOfBathrooms
                },
                {
                  name: 'Add specific property features',
                  checked: Object.values(propertyService.state.specificPropertyFeatures).includes(true)
                },
                {
                  name: 'Add property images',
                  checked: propertyService.state.propertyImages.length >= 6
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
                Area details
              </Typography>
              <div className='section-content'>
                <TextField
                  label='Property area (in sqm)'
                  required
                  value={propertyService.state.area}
                  onChange={({ target: { value } }) => propertyService.setArea(value)}
                />
              </div>
            </div>

            <div className='section rooms-details-section'>
              <Typography className='section-title' variant='body4'>
                Rooms details
              </Typography>
              <div className='section-content'>
                <TextField
                  label='Number of bedrooms'
                  required
                  value={propertyService.state.nrOfBedrooms}
                  onChange={({ target: { value } }) => propertyService.setNrOfBedrooms(value)}
                />
                <TextField
                  label='Number of bathrooms'
                  required
                  value={propertyService.state.nrOfBathrooms}
                  onChange={({ target: { value } }) => propertyService.setNrOfBathrooms(value)}
                />
              </div>
            </div>

            <div className='section specific-property-features-section'>
              <Typography className='section-title' variant='body4'>
                Specific property features
              </Typography>
              <div className='section-content'>
                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          parkingSpot: !propertyService.state.specificPropertyFeatures.parkingSpot
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.parkingSpot}
                    />
                    <label htmlFor={id}>Parking spot</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          garden: !propertyService.state.specificPropertyFeatures.garden
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.garden}
                    />
                    <label htmlFor={id}>Garden</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          terrace: !propertyService.state.specificPropertyFeatures.terrace
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.terrace}
                    />
                    <label htmlFor={id}>Terrace</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          fullyFurnished: !propertyService.state.specificPropertyFeatures.fullyFurnished
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.fullyFurnished}
                    />
                    <label htmlFor={id}>Fully furnished</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          partiallyFurnished:
                            !propertyService.state.specificPropertyFeatures.partiallyFurnished
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.partiallyFurnished}
                    />
                    <label htmlFor={id}>Partially furnished</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          unfurnished: !propertyService.state.specificPropertyFeatures.unfurnished
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.unfurnished}
                    />
                    <label htmlFor={id}>Unfurnished</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          doubleGlazing: !propertyService.state.specificPropertyFeatures.doubleGlazing
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.doubleGlazing}
                    />
                    <label htmlFor={id}>Double glazing</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          allowsSmoking: !propertyService.state.specificPropertyFeatures.allowsSmoking
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.allowsSmoking}
                    />
                    <label htmlFor={id}>Allows smoking</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          allowsPets: !propertyService.state.specificPropertyFeatures.allowsPets
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.allowsPets}
                    />
                    <label htmlFor={id}>Allows pets</label>
                  </div>
                ))(React.useId())}

                {((id: string) => (
                  <div className='switch-wrapper'>
                    <Switch
                      id={id}
                      size='small'
                      onChange={() =>
                        propertyService.setSpecificPropertyFeatures({
                          ...propertyService.state.specificPropertyFeatures,
                          closeToPublicTransport:
                            !propertyService.state.specificPropertyFeatures.closeToPublicTransport
                        })
                      }
                      checked={propertyService.state.specificPropertyFeatures.closeToPublicTransport}
                    />
                    <label htmlFor={id}>Close to public transport</label>
                  </div>
                ))(React.useId())}
              </div>
            </div>

            <div className='section property-images-section'>
              <div className='section-texts'>
                <Typography className='section-title' variant='body4'>
                  Property images
                </Typography>

                <Typography variant='body5'>
                  Add a minimum of 6 images. Make sure the pictures are up to date and reveal the current
                  state of your property.
                </Typography>
              </div>
              <div className='section-content'>
                <div className='images-list'>
                  {propertyService.state.propertyImages.map((image, imageIndex) => (
                    <div key={imageIndex} className='image-wrapper'>
                      <IconButton
                        size='large'
                        className='remove-button'
                        onClick={() => {
                          propertyService.setPropertyImages(
                            propertyService.state.propertyImages.filter((_, i) => i !== imageIndex)
                          );
                        }}>
                        <Icon icon='minus' size={11} />
                      </IconButton>
                      <img alt='property image' src={URL.createObjectURL(image)} />
                    </div>
                  ))}
                </div>
                <Upload
                  multiple
                  accept='image/*'
                  onFiles={(files) => {
                    propertyService.setPropertyImages([...propertyService.state.propertyImages, ...files]);
                  }}
                  button={
                    <IconButton size='large' className='add-button'>
                      <Icon icon='plus-1' size={16} />
                    </IconButton>
                  }></Upload>
              </div>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button
            variant='secondary'
            size='large'
            startIcon={<Icon icon='arrow-left-1' size={12} />}
            onClick={() => propertyService.setCurrentStep(1)}>
            back back
          </Button>
          <Button
            onClick={() => propertyService.setCurrentStep(3)}
            size='large'
            endIcon={<Icon icon='arrow-right-1' size={12} />}>
            Next
          </Button>
        </div>
      </div>
    );
  }
)`
  &.new-property-step-2 {
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
