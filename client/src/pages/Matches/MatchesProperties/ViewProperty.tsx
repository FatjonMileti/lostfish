import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { Modal, ModalProps } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import React, { useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import { Map } from './ViewProperty.Map';
import classNames from 'classnames';
import { Carousel } from './MatchesProperties.Carousel';
import { NearestThings } from './ViewProperty.NearestThings';
import { PropertyType } from './MatchesProperties';
import { avatars } from '../../HomeLoggedIn/avatars';

interface ViewPropertyModalProps extends ModalProps {
  propertyToView: PropertyType;
  starProperty: () => void;
}

export const ViewProperty = styled(
  ({ className, closeModal, propertyToView, starProperty, ...rest }: ViewPropertyModalProps) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const property = propertyToView.property;
    let parsedProperty: any = {};
    parsedProperty.images = property?.property_images.map(({ link }) => link) || [];
    parsedProperty.avatar = !isNaN(parseInt(property.created_by.avatar || ''))
      ? avatars[parseInt(property.created_by.avatar || '')]?.image
      : '';
    parsedProperty.areaOfInterest = property.area_of_interest;
    parsedProperty.numberOfBedrooms = property?.room_details?.number_of_bedrooms;
    parsedProperty.numberOfBathrooms = property?.room_details?.number_of_bathrooms;
    parsedProperty.propertyOwnerName = `${property.created_by.first_name} ${property.created_by.last_name}`;
    parsedProperty.rentingPrice = property.asset_rent?.rental_amount;
    parsedProperty.propertyType = property?.property_type || '';
    parsedProperty.propertyArea = property?.floor_size;
    parsedProperty.parkingSpot = (property?.specific_property_features || []).includes('Parking spot');
    parsedProperty.energyCertificate = (property?.contract_details || []).includes('energyCertificate');
    parsedProperty.address = {
      lat: property?.asset_address?.latitude,
      lng: property?.asset_address?.longitude
    };
    parsedProperty.isPropertyStarred = propertyToView.starred;

    return (
      <Modal className={classNames('view-property-modal', className)} {...rest}>
        <div className='modal-header'>
          <div className='avatar-wrapper'>
            <Avatar image={parsedProperty.avatar} />
            <Typography variant='body4'>{parsedProperty.propertyOwnerName}</Typography>
            <Typography variant='body4' className='dot'>
              •
            </Typography>
            <Typography variant='body4'>{property.percentage}%</Typography>
          </div>
          <IconButton className='close-modal-button' size='large' onClick={closeModal}>
            <Icon icon='close' size={18} />
          </IconButton>
        </div>

        <Carousel
          indexStore={[activeImageIndex, setActiveImageIndex]}
          images={parsedProperty.images}></Carousel>

        <div className='description'>
          <div className='description-header'>
            <div className='title'>
              <Typography variant='body2'>Two bedroom apartment for rent</Typography>
              <IconButton
                size='large'
                className={classNames('stared-button', { active: parsedProperty.isPropertyStarred })}
                onClick={starProperty}>
                <Icon icon='star' size={20} />
              </IconButton>
            </div>
            <div className='property-details'>
              <div className='detail'>
                <Icon icon='location' />
                <Typography variant='body5'>{parsedProperty.areaOfInterest}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>£{parsedProperty.rentingPrice?.toLocaleString()} PCM</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='double-bed' />
                <Typography variant='body5'>{parsedProperty.numberOfBedrooms}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='bathtub' />
                <Typography variant='body5'>{parsedProperty.numberOfBathrooms}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='building' />
                <Typography variant='body5'>{parsedProperty.propertyType}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='ruler' />
                <Typography variant='body5'>
                  {!isNaN(parseInt(parsedProperty.propertyArea || ''))
                    ? parseInt(parsedProperty.propertyArea || '') * 10.76
                    : ''}{' '}
                  sqft/
                  {parsedProperty.propertyArea} sqm
                </Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              {parsedProperty.parkingSpot && (
                <>
                  <div className='detail'>
                    <Icon icon='car' />
                    <Typography variant='body5'>Parking Spot</Typography>
                  </div>
                  <Typography variant='body4' className='dot'>
                    •
                  </Typography>
                </>
              )}

              {parsedProperty.energyCertificate && (
                <div className='detail'>
                  <Icon icon='temperature' />
                  <Typography variant='body5'>EPC Rating: C*</Typography>
                </div>
              )}
            </div>
          </div>
          <div className='section'>
            <Typography variant='body4' className='label'>
              Description
            </Typography>
            <Typography variant='body4' className='section-description'>
              One bed room large FF Flat available to rent, situated 7 minutes walk to Hainault tube station,
              the property is fully furnished. Having a separate large reception, the property comes with one
              allocated parking.
            </Typography>
          </div>
          <div className='section'>
            <Typography variant='body4' className='label'>
              Location details
            </Typography>
            <Typography variant='body4' className='section-description'>
              Sitting midway between Battersea Park and Clapham Junction, The Set offers an enviable variety
              of entertainment, dining, drinking and shopping opportunities alongside excellent schools and
              first rate transport connections.Battersea is an intimate residential area, with great
              restaurants and bars, all close by. Just down the road is Battersea Square. Its unique setting
              and continental style dining add a laid-back, village feel to this very special area of London.
              Battersea itself is a veritable cultural haven, home to the Pump House Gallery and the Battersea
              Arts Centre, a celebrated fringe venue.
            </Typography>
          </div>
          <Map address={parsedProperty.address} />

          <NearestThings location={parsedProperty.address} />

          <div className='facilities-wrapper'>
            <Typography variant='body4' className='label'>
              Facilities
            </Typography>
            <div className='facilities'>
              <ul>
                <li>
                  <Typography variant='body4'>Open plan reception/dining room</Typography>
                </li>
                <li>
                  <Typography variant='body4'>Modern kitchen with Siemens appliances</Typography>
                </li>
                <li>
                  <Typography variant='body4'> Two double bedrooms</Typography>
                </li>
              </ul>

              <ul>
                <li>
                  <Typography variant='body4'>Two bathrooms (en-suite) </Typography>
                </li>
                <li>
                  <Typography variant='body4'>Private patio garden</Typography>
                </li>
                <li>
                  <Typography variant='body4'>Private patio garden</Typography>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
)`
  &.view-property-modal {
    overflow-y: auto;
    max-height: calc(100vh - 80px);
    height: max-content;
    width: 1020px;

    && {
      border-radius: 0;
      max-width: 100vw;
      top: calc(50% + 40px);
      left: 50%;
      transform: translate(-50%, -50%);
      background: none;
    }

    .modal-container {
      border-radius: 12px;
      overflow: hidden;
      padding: 0 !important;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;

      background-color: white;

      .modal-header {
        position: absolute;
        top: 0;
        z-index: 2;

        display: flex;
        width: 100%;
        padding: 32px;
        justify-content: space-between;
        align-items: flex-start;
        box-sizing: border-box;

        background: linear-gradient(180deg, rgba(38, 38, 38, 0.7) 0%, rgba(38, 38, 38, 0) 100%);

        .avatar-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 244px;

          .typography {
            color: #fff;
            font-size: 18px;
            font-weight: 700;
          }

          .dot {
            color: #cfd5d5;
          }
        }

        .close-modal-button {
          padding: 15px;
          z-index: 1;
          &:hover {
            background: #184d6d;
            color: #fff;
          }
        }
      }

      .description {
        display: flex;
        padding: 32px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 24px;
        align-self: stretch;

        .description-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;

          .title {
            display: flex;
            align-items: center;
            gap: 24px;
            align-self: stretch;

            .typography {
              flex: 1 0 0;
              font-weight: 400;
              line-height: 40px;
            }

            .stared-button {
              padding: 12px;
              border: 2px solid #184d6d;

              &:hover {
                border: 2px solid #fff;
                background: #184d6d;
                color: #fff;
              }

              &.active {
                border: 2px solid #fff;
                background: #184d6d;
                color: #fff;
              }
            }
          }

          .property-details {
            color: #000;
            font-weight: 700;
            display: flex;
            column-gap: 8px;
            align-items: center;

            .detail {
              display: flex;
              column-gap: 4px;
              align-items: center;
            }

            .dot {
              color: #a7a7a7;
            }
          }
        }

        .section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .label {
            color: #0d2a38;
            font-weight: 700;
          }

          .section-description {
            align-self: stretch;
            font-weight: 400;
          }
        }
        .map {
          height: 240px;
          align-self: stretch;
        }

        .facilities-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .label {
            font-size: 18px;
            color: #0d2a38;
            font-weight: 700;
          }

          .facilities {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            align-self: stretch;

            .typography {
              flex: 1 0 0;
              font-style: normal;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
`;
