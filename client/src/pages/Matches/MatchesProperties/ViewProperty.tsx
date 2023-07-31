import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';

import { Modal, ModalProps } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import React, { useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import { ArrowButton } from '../../../components/ArrowButton';
import { Map } from './ViewProperty.Map';
import { NearestPlaces } from '../../Properties/pages/PropertyDetails/components/NearestPlaces';
import { NearestSchools } from '../../Properties/pages/PropertyDetails/components/NearestSchools';
import { NearestImportantPlaces } from '../../Properties/pages/PropertyDetails/components/NearestImportantPlaces';
import { Button } from '../../../components/Button';
import Underground from './Underground.svg';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { Carousel } from './MatchesProperties.Carousel';

interface ViewPropertyModalProps extends ModalProps {
  refineYourSearchClick?: () => void;
  images: string[];
  avatar: string;
  propertyOwnerName: string;
  areaOfInterest?: string;
  numberOfBedrooms?: string;
  numberOfBathrooms?: string;
  propertyType: string;
  propertyArea: string;
  rentingPrice?: string;
  parkingSpot: boolean;
  energyCertificate?: boolean;
  address: any;
  starProperty: () => void;
  isPropertyStarred: boolean;
}

export const ViewProperty = styled(
  ({
    className,
    closeModal,
    images,
    avatar,
    propertyOwnerName,
    numberOfBedrooms,
    numberOfBathrooms,
    rentingPrice,
    areaOfInterest,
    propertyType,
    propertyArea,
    parkingSpot,
    energyCertificate,
    address,
    refineYourSearchClick = () => {},
    starProperty,
    isPropertyStarred,
    ...rest
  }: ViewPropertyModalProps) => {
    const [selectedButton, setSelectedButton] = useState('stations');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const previous = () => {
      activeImageIndex > 0
        ? setActiveImageIndex(activeImageIndex - 1)
        : setActiveImageIndex(images.length - 1);
    };

    const next = () => {
      activeImageIndex < images.length - 1
        ? setActiveImageIndex(activeImageIndex + 1)
        : setActiveImageIndex(0);
    };

    return (
      <Modal className={classNames('view-property-modal', className)} {...rest}>
        <div className='modal-header'>
          <div className='avatar-wrapper'>
            <Avatar image={avatar} />
            <Typography variant='body4'>{propertyOwnerName}</Typography>
            <Typography variant='body4' className='dot'>
              •
            </Typography>
            <Typography variant='body4'>34%</Typography>
          </div>
          <IconButton className='close-modal-button' size='large' onClick={closeModal}>
            <Icon icon='close' size={18} />
          </IconButton>
        </div>

        <Carousel indexStore={[activeImageIndex, setActiveImageIndex]} images={images}></Carousel>

        <div className='description'>
          <div className='description-header'>
            <div className='title'>
              <Typography variant='body2'>Two bedroom apartment for rent</Typography>
              <IconButton
                size='large'
                className={classNames('stared-button', { active: isPropertyStarred })}
                onClick={starProperty}>
                <Icon icon='star' size={20} />
              </IconButton>
            </div>
            <div className='property-details'>
              <div className='detail'>
                <Icon icon='location' />
                <Typography variant='body5'>{areaOfInterest}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>£{rentingPrice?.toLocaleString()} PCM</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='double-bed' />
                <Typography variant='body5'>{numberOfBedrooms}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='bathtub' />
                <Typography variant='body5'>{numberOfBathrooms}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='building' />
                <Typography variant='body5'>{propertyType}</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='ruler' />
                <Typography variant='body5'>
                  {!isNaN(parseInt(propertyArea || '')) ? parseInt(propertyArea || '') * 10.76 : ''} sqft/
                  {propertyArea} sqm
                </Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              {parkingSpot && (
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

              {energyCertificate && (
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
          <Map address={address} className='map' />
          {/*   <div className='nearest-locations-wrapper'> */}
          {/*     <div className='buttons-wrapper'> */}
          {/*       <Button */}
          {/*         variant='primary' */}
          {/*         inverted */}
          {/*         size='large' */}
          {/*         onClick={() => setSelectedButton('stations')} */}
          {/*         active={selectedButton === 'stations'}> */}
          {/*         Nearest stations */}
          {/*       </Button> */}
          {/*       <Button */}
          {/*         variant='primary' */}
          {/*         inverted */}
          {/*         size='large' */}
          {/*         onClick={() => setSelectedButton('Schools')} */}
          {/*         active={selectedButton === 'Schools'}> */}
          {/*         Nearest schools */}
          {/*       </Button> */}
          {/*       <Button */}
          {/*         variant='primary' */}
          {/*         inverted */}
          {/*         size='large' */}
          {/*         onClick={() => setSelectedButton('ImportantPlaces')} */}
          {/*         active={selectedButton === 'ImportantPlaces'}> */}
          {/*         Important places */}
          {/*       </Button> */}
          {/*     </div> */}
          {/*     <div className='nearest-locations'> */}
          {/*       {selectedButton === 'stations' ? ( */}
          {/*         <NearestPlaces location={address} /> */}
          {/*       ) : selectedButton === 'Schools' ? ( */}
          {/*         <NearestSchools location={address} /> */}
          {/*       ) : selectedButton === 'ImportantPlaces' ? ( */}
          {/*         <NearestImportantPlaces location={address} /> */}
          {/*       ) : null} */}
          {/*     </div> */}
          {/*   </div> */}
          {/*   <div className='facilities-wrapper'> */}
          {/*     <Typography variant='body4' className='label'> */}
          {/*       Facilities */}
          {/*     </Typography> */}
          {/*     <div className='facilities'> */}
          {/*       <ul> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'>Open plan reception/dining room</Typography> */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'>Modern kitchen with Siemens appliances</Typography> */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'> Two double bedrooms</Typography> */}
          {/*         </li> */}
          {/*       </ul> */}

          {/*       <ul> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'>Two bathrooms (en-suite) </Typography> */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'>Private patio garden</Typography> */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           <Typography variant='body4'>Private patio garden</Typography> */}
          {/*         </li> */}
          {/*       </ul> */}
          {/*     </div> */}
          {/*   </div> */}
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
    }

    .modal-container {
      padding: 0 !important;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;

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
        .nearest-locations-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;

          .buttons-wrapper {
            display: flex;
            padding: 4px;
            align-items: flex-start;
            border-radius: 2500px;
            border: 1px solid #e7e7e7;

            .active {
              background: #eee0d3;
              font-weight: 600;
            }

            button {
              font-weight: 400;
              font-size: 16px;
            }

            button:hover {
              background: #eee0d3;
            }
          }

          .nearest-locations {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;

            li {
              .MuiTypography-root {
                color: #000;
                font-family: Roobert;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
              }
            }

            li::before {
              content: url(${Underground});
              padding-right: 8px;
            }

            li::after {
              content: ' | 0.4mi.';
              padding-left: 8px;
              font-weight: 700;
              color: #184d6d;
            }
          }
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
