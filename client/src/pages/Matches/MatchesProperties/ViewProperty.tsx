import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';

import { Modal, ModalProps } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import React, { useState } from 'react';
import { useProfileStore } from '../../../globalState/profile';
import apartament from '../images/gallery-4.png';
import apartament1 from '../images/gallery-1.png';
import apartament2 from '../images/gallery-2.png';
import apartament3 from '../images/gallery-3.png';
import apartament5 from '../images/gallery-5.png';
import { Avatar } from '../../../components/Avatar';
import { ArrowButton } from '../../../components/ArrowButton';
import { Map } from '../../Properties/pages/PropertyDetails/components/Map';
import { NearestPlaces } from '../../Properties/pages/PropertyDetails/components/NearestPlaces';
import { NearestSchools } from '../../Properties/pages/PropertyDetails/components/NearestSchools';
import { NearestImportantPlaces } from '../../Properties/pages/PropertyDetails/components/NearestImportantPlaces';
import { Button } from '../../../components/Button';
import Underground from './Underground.svg';
import { motion } from 'framer-motion';

interface ViewPropertyModalProps extends ModalProps {
  refineYourSearchClick?: () => void;
  image: string;
  avatar: string;
  propertyOwnerName: string;
  areaOfInterest?: string;
  numberOfBedrooms?: string;
  numberOfBathrooms?: string;
  rentingPrice?: string;
  address: any;
}

export const ViewProperty = styled(
  ({
    closeModal,
    image,
    avatar,
    propertyOwnerName,
    numberOfBedrooms,
    numberOfBathrooms,
    rentingPrice,
    areaOfInterest,
    address,
    refineYourSearchClick = () => {},
    ...rest
  }: ViewPropertyModalProps) => {
    const [selectedButton, setSelectedButton] = useState('stations');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = [image, apartament, apartament1, apartament2, apartament3, apartament5, apartament];
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
      <Modal {...rest}>
        <div className='img' style={{ backgroundImage: `url(${images[activeImageIndex]})` }}>
          <div className='content'>
            <div className='header'>
              <div className='avatar-wrapper'>
                <Avatar image={avatar} />
                <Typography variant='body4'>{propertyOwnerName}</Typography>
                <Typography variant='body4' className='dot'>
                  •
                </Typography>
                <Typography variant='body4'>34%</Typography>
              </div>
              <IconButton size='large' onClick={closeModal}>
                <Icon icon='close' size={12} />
              </IconButton>
            </div>
            <div className='footer'>
              <ArrowButton direction='left' hero onClick={previous} />
              <div className='images'>
                {images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    className={index === activeImageIndex ? 'active' : ''}
                    onClick={() => setActiveImageIndex(index)}
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 1 }}
                  />
                ))}
              </div>
              <ArrowButton direction='right' hero onClick={next} />
            </div>
          </div>
        </div>
        <div className='description'>
          <div className='description-header'>
            <div className='title'>
              <Typography variant='body2'>Two bedroom apartment for rent</Typography>
              <IconButton size='large'>
                <Icon icon='star' size={14} />
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
              {/* /////// */}
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>Apartament</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='ruler' />
                <Typography variant='body5'>796 sqft/74 sqm</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>1 Parking Spot</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>EPC Rating: C*</Typography>
              </div>
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
          <div className='nearest-locations-wrapper'>
            <div className='buttons-wrapper'>
              <Button
                variant='primary'
                inverted
                size='large'
                onClick={() => setSelectedButton('stations')}
                active={selectedButton === 'stations'}>
                Nearest stations
              </Button>
              <Button
                variant='primary'
                inverted
                size='large'
                onClick={() => setSelectedButton('Schools')}
                active={selectedButton === 'Schools'}>
                Nearest schools
              </Button>
              <Button
                variant='primary'
                inverted
                size='large'
                onClick={() => setSelectedButton('ImportantPlaces')}
                active={selectedButton === 'ImportantPlaces'}>
                Important places
              </Button>
            </div>
            <div className='nearest-locations'>
              {selectedButton === 'stations' ? (
                <NearestPlaces location={address} />
              ) : selectedButton === 'Schools' ? (
                <NearestSchools location={address} />
              ) : selectedButton === 'ImportantPlaces' ? (
                <NearestImportantPlaces location={address} />
              ) : null}
            </div>
          </div>
          <div className='facilities-wrapper'>
            <Typography variant='body4' className='label'>
              Facilities
            </Typography>
            <div className='facilities'>
              <Typography variant='body4'>
                <ul>
                  <li>Open plan reception/dining room</li>
                  <li>Modern kitchen with Siemens appliances</li>
                  <li> Two double bedrooms</li>
                </ul>
              </Typography>
              <Typography variant='body4'>
                <ul>
                  <li>Two bathrooms (en-suite)</li>
                  <li>Private patio garden</li>
                  <li> Duplex apartment</li>
                </ul>
              </Typography>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
)`
  & {
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw !important;
    width: 1020px;

    .modal-container {
      padding: 0 !important;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;

      .img {
        // background-image: url(${(props) => props.image});

        background-repeat: no-repeat;
        background-size: cover;
        width: 1020px;
        height: 574px;
        box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.04);

        display: grid;

        .content {
          display: flex;
          height: 574px;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;

          .header {
            display: flex;
            width: 1020px;
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

            .icon-button {
              &:hover {
                background: #184d6d;
                color: #fff;
              }
            }
          }
          .footer {
            display: flex;
            padding: 32px;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;

            background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 100%);

            .arrow-button: hover {
              border-color: #fff;
            }

            .icon {
              color: #fff;
            }

            .images {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;

              img {
                width: 92px;
                height: 61px;
                border-radius: 4px;
                opacity: 0.7;

                :hover {
                  border: 2px solid #f7f1e7;
                  opacity: 1;
                  z-index: 1;
                }
              }

              .active {
                border: 2px solid #f7f1e7;
                opacity: 1;
              }
            }
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

            .icon-button {
              border: 2px solid #184d6d;

              &:hover {
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
