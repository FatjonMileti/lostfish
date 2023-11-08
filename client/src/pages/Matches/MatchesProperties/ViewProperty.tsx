import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';
import { Modal, ModalProps } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import React, { useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import { Map } from '../../../components/Map';
import classNames from 'classnames';
import { Carousel } from './MatchesProperties.Carousel';
import { NearestThings } from './ViewProperty.NearestThings';
import { SuggestedPropertyType } from './MatchesProperties';
import { avatars } from '../../HomeLoggedIn/avatars';

import { AreaUnit } from '../../Properties/NewProperty/property.constants';
import { CloseButton } from '../../../components/CloseButton';
import { UnMatchButton } from '../../../components/UnMatchButton';
import { MatchButton } from '../../../components/MatchButton';

interface ViewPropertyModalProps extends ModalProps {
  propertyToView: SuggestedPropertyType;
  starProperty: () => void;
  likeProperty?: () => void;
  dislikeProperty?: () => void;
  disableLikeProperty?: boolean;
}

export const ViewProperty = styled(
  ({
    className,
    closeModal,
    propertyToView,
    starProperty,
    likeProperty = () => {},
    dislikeProperty = () => {},
    disableLikeProperty = false,
    ...rest
  }: ViewPropertyModalProps) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const property = propertyToView.property;
    let parsedProperty: any = {};
    parsedProperty.images = property?.property_images.map(({ link }) => link) || [];
    parsedProperty.avatar = !isNaN(parseInt(property.created_by.avatar || ''))
      ? avatars[parseInt(property.created_by.avatar || '')]?.image
      : '';
    parsedProperty.areaOfInterest = property.area_of_interest;
    parsedProperty.title = property?.title;
    parsedProperty.description = property?.description;
    parsedProperty.numberOfBedrooms = property?.room_details?.number_of_bedrooms;
    parsedProperty.numberOfBathrooms = property?.room_details?.number_of_bathrooms;
    parsedProperty.propertyOwnerName = `${property.created_by.first_name} ${property.created_by.last_name}`;
    parsedProperty.rentingPrice = `£${property.budget.min_budget} - £${property.budget.max_budget}`;
    parsedProperty.propertyType = property?.property_type || '';
    parsedProperty.propertyArea = property?.floor_size;
    parsedProperty.propertyAreaUnit = property?.floor_size_unit;

    parsedProperty.parkingSpot = property.parking_spot;
    parsedProperty.energyCertificate = property.epc_rating;
    parsedProperty.address = {
      lat: property?.asset_address?.latitude,
      lng: property?.asset_address?.longitude
    };
    parsedProperty.houseType = property?.house_details?.house_type;
    parsedProperty.propertyType = property?.property_type;
    parsedProperty.isPropertyStarred = propertyToView.starred;

    return (
      <Modal className={classNames('view-property-modal', className)} {...rest}>
        <div className='modal-header'>
          <Typography variant='body2'>Property details</Typography>

          <div className='buttons'>
            <div className='like-buttons'>
              <UnMatchButton onClick={dislikeProperty} />
              <MatchButton onClick={likeProperty} disabled={disableLikeProperty} />
            </div>
            <CloseButton onClick={closeModal} />
          </div>
        </div>

        <div className='modal-content'>
          <Carousel
            indexStore={[activeImageIndex, setActiveImageIndex]}
            images={parsedProperty.images}></Carousel>
          <div className='details-side'>
            <div className='description-header'>
              <div className='title'>
                <Typography variant='body2'>{parsedProperty.title}</Typography>
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
                  <Typography variant='body5'>£{parsedProperty.rentingPrice} PCM</Typography>
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
                    {parsedProperty.propertyAreaUnit === AreaUnit.SquareFoot
                      ? parsedProperty.propertyArea
                      : (parseInt(parsedProperty.propertyArea || '') * 10.764).toFixed(0)}{' '}
                    {AreaUnit.SquareFoot}/
                    {parsedProperty.propertyAreaUnit === AreaUnit.SquareMeter
                      ? parsedProperty.propertyArea
                      : (parseInt(parsedProperty.propertyArea || '') / 10.764).toFixed(0)}{' '}
                    {AreaUnit.SquareMeter}
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
                    <Typography variant='body5'>EPC Rating: {parsedProperty.energyCertificate}</Typography>
                  </div>
                )}
              </div>
            </div>
            <div className='section'>
              <Typography variant='body4' className='label'>
                Description
              </Typography>
              <Typography variant='body4'>{parsedProperty.description}</Typography>
            </div>
            <Map className='view-property-map' address={parsedProperty.address} />

            <NearestThings location={parsedProperty.address} />

            <div className='facilities-wrapper'>
              <Typography variant='body4' className='label'>
                Facilities
              </Typography>
              <div className='facilities'>
                <ul>
                  <li>
                    <Typography variant='body4'>{parsedProperty.propertyType}</Typography>
                  </li>
                  {!!property.parking_spot && property.parking_spot > 0 ? (
                    <li>
                      <Typography variant='body4'>
                        {property.parking_spot === 1
                          ? 'Parking spot: ' + property.parking_spot
                          : 'Parking spots: ' + property.parking_spot}
                        {!!property.parking_details ? ', ' + property.parking_details : ''}
                      </Typography>
                    </li>
                  ) : (
                    ''
                  )}

                  {!!property.condition ? (
                    <li>
                      <Typography variant='body4'> {'Condition: ' + property.condition}</Typography>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>

                <ul>
                  {/*<li>*/}
                  {/*  <Typography variant='body4'>Two bathrooms (en-suite) </Typography>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <Typography variant='body4'>Private patio garden</Typography>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <Typography variant='body4'>Duplex apartment</Typography>*/}
                  {/*</li>*/}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
)`
  &.view-property-modal {
    width: 100vw;
    height: 100vh;

    position: relative;
    overflow: hidden;
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw;

    border-radius: 0;

    .modal-container {
      padding: 0 !important;
      display: grid;
      grid-template-rows: max-content auto;

      .modal-header {
        display: flex;
        width: 100%;
        padding: 20px 36px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;

        border-bottom: 2px solid #f3f4f5;
        /* Nav Shadow */
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);

        .buttons {
          display: flex;
          align-items: center;
          gap: 32px;

          .icon-button {
            padding: 16px;
            width: 56px;
            height: 56px;
          }

          .like-buttons {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }
        }
      }

      .modal-content {
        display: grid;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;

        .details-side {
          display: grid;
          padding: 32px;
          box-sizing: border-box;
          gap: 24px;

          .description-header {
            display: grid;
            gap: 24px;

            .title {
              display: flex;
              justify-content: space-between;
              gap: 24px;

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
            display: grid;
            gap: 8px;

            .label {
              font-size: 18px;
              font-weight: 700;
            }
          }

          .view-property-map {
            height: 480px;
          }

          .facilities-wrapper {
            display: grid;
            gap: 8px;

            .label {
              font-size: 18px;
              color: #0d2a38;
              font-weight: 700;
            }

            .facilities {
              width: 100%;
              display: grid;
              grid-template-columns: 1fr 1fr;
              justify-content: space-between;
              gap: 8px;
            }
          }
        }
      }
    }
  }
`;
