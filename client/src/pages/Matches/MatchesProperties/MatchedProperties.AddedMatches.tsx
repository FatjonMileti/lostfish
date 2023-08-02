import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { avatars } from '../../HomeLoggedIn/avatars';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchedSlide } from './MatchesProperties';
import { Button } from '../../../components/Button';
import { ViewProperty } from './ViewProperty';

interface AddedMatchedProperty {
  _id: string;

  property: {
    _id: string;
    property_images: { link: string }[];
    area_of_interest: string;
    property_type?: string;
    floor_size: string;
    specific_property_features?: string[];
    contract_details?: string[];
    room_details: {
      number_of_bathrooms: string;
      number_of_bedrooms: string;
    };

    asset_rent: {
      rental_amount?: string;
    };

    id: string;

    asset_address: any;

    created_by: {
      email: string;
      first_name: string;
      last_name: string;
      avatar: string;
    };
  };

  matchId?: string;
  chosen: boolean;
  starred: boolean;
}

interface AddedMatchesProps extends HTMLAttributes<HTMLDivElement> {
  properties: AddedMatchedProperty[];
  setProperties: (
    properties: AddedMatchedProperty[] | ((properties: AddedMatchedProperty[]) => AddedMatchedProperty[])
  ) => void;
  removePropertyMatch: (propertyId: string, matchId: string) => void;
  starProperty: (propertyId: string, chosen: boolean) => void;
  checkProperty: () => void;
}
export const AddedMatches = styled(
  ({ className, properties, removePropertyMatch, starProperty, checkProperty }: AddedMatchesProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const [viewPropertyModalVisibility, setViewPropertyModalVisibility] = React.useState(false);

    const matchedProperty: AddedMatchedProperty = properties[activeSlide];
    const property = matchedProperty.property;

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % properties?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    return (
      <div className={classNames('matches-slider', className)}>
        <ViewProperty
          open={viewPropertyModalVisibility}
          closeModal={() => setViewPropertyModalVisibility(false)}
          onBackdropClick={() => setViewPropertyModalVisibility(false)}
          images={matchedProperty.property?.property_images.map(({ link }) => link) || []}
          avatar={
            !isNaN(parseInt(property.created_by?.avatar || ''))
              ? avatars[parseInt(property.created_by?.avatar || '')]?.image
              : ''
          }
          areaOfInterest={matchedProperty.property?.area_of_interest || ''}
          numberOfBedrooms={matchedProperty.property?.room_details?.number_of_bedrooms}
          rentingPrice={matchedProperty.property?.asset_rent?.rental_amount}
          numberOfBathrooms={matchedProperty.property?.room_details?.number_of_bathrooms}
          propertyOwnerName={`${property.created_by?.first_name} ${property.created_by?.last_name}`}
          propertyType={matchedProperty.property?.property_type || ''}
          propertyArea={matchedProperty.property?.floor_size}
          parkingSpot={(matchedProperty.property?.specific_property_features || []).includes('Parking spot')}
          energyCertificate={(matchedProperty.property?.contract_details || []).includes('energyCertificate')}
          address={{
            lat: matchedProperty.property?.asset_address?.latitude,
            lng: matchedProperty.property?.asset_address?.longitude
          }}
          refineYourSearchClick={() => {
            setViewPropertyModalVisibility(false);
          }}
          starProperty={() => starProperty(matchedProperty.property._id, matchedProperty.chosen)}
          isPropertyStarred={matchedProperty.starred}
        />

        <div className='matches-slider-body'>
          <div className='trust-score-section'>
            <Typography variant='body3' className='improve-trust-score-title'>
              Did you know?
            </Typography>
            <Typography variant='body4' className='trust-score-description'>
              Once you decide on your perfect match you will be able to get in touch and discuss more. You can
              choose to view the property or have a Lostfish representative do that for you. Once finished you
              can close the deal through our assisted platform.
            </Typography>

            <Label variant='tertiary' size='medium' className='improve-link'>
              Find out more
            </Label>
          </div>
          <div className='slides-wrapper'>
            {properties.map(({ property }, propertyIndex) => {
              const property_images: any = property?.property_images.map(({ link }) => link);
              return (
                <MatchedSlide
                  key={propertyIndex}
                  className={`${propertyIndex === activeSlide ? 'active' : ''}`}
                  image={`${property_images?.[0]}`}
                  propertyOwnerName={`${property.created_by.first_name} ${property.created_by.last_name}`}
                  avatar={
                    !isNaN(parseInt(property.created_by.avatar || ''))
                      ? avatars[parseInt(property.created_by.avatar || '')]?.image
                      : ''
                  }
                  animate={{
                    x:
                      propertyIndex < activeSlide
                        ? `calc(${-100 * propertyIndex}% - ${propertyIndex * 24}px)`
                        : `calc(${-100 * activeSlide}% - ${24 * activeSlide - propertyIndex}px)`,
                    scale: propertyIndex < activeSlide ? 0.9 : 1,
                    y: propertyIndex >= activeSlide ? `0` : `32px`,
                    opacity: propertyIndex === activeSlide ? 1 : 0.5
                  }}
                  transition={{ ease: 'easeOut', duration: 0.5 }}
                  areaOfInterest={property.area_of_interest}
                  numberOfBedrooms={property?.room_details?.number_of_bedrooms}
                  rentingPrice={property.asset_rent?.rental_amount}
                  numberOfBathrooms={property?.room_details?.number_of_bathrooms}
                  viewProperty={() => setViewPropertyModalVisibility(true)}
                />
              );
            })}
          </div>
        </div>
        <div className='matches-slider-footer'>
          <ArrowButton
            direction='left'
            onClick={previous}
            style={{ visibility: activeSlide === 0 ? 'hidden' : 'initial' }}
            size='large'
          />
          <div className='match-actions'>
            <Button
              startIcon={<Icon icon='email' size={24} />}
              size='large'
              className={classNames({ active: false })}
              onClick={() => {
                // if (matchedProperty?._id) {
                //   removePropertyMatch(matchedProperty.property._id, matchedProperty._id);
                // }
              }}>
              Messages
            </Button>

            <Button
              variant='secondary'
              startIcon={<Icon icon='close' size={24} />}
              size='large'
              className={classNames({ active: false })}
              onClick={() => {}}>
              Unmatch
            </Button>
          </div>
          <ArrowButton
            direction='right'
            onClick={next}
            size='large'
            style={{ visibility: properties.length === 1 ? 'hidden' : 'initial' }}
          />
        </div>
      </div>
    );
  }
)`
  &.matches-slider {
    display: grid;
    align-content: space-between;

    .matches-slider-body {
      display: grid;
      grid-template-columns: 1fr 3fr;
      column-gap: 24px;

      .trust-score-section {
        display: grid;
        align-content: center;

        .improve-trust-score-title {
          margin-top: 16px;
          font-family: At Gambit, serif;
        }

        .trust-score-description {
          margin-top: 16px;
        }

        .improve-link {
          margin-top: 24px;
        }
      }

      .slides-wrapper {
        padding-bottom: 40px;
        padding-left: 24px;
        margin-left: -24px;
        margin-right: -36px;
        display: flex;
        column-gap: 24px;

        overflow-x: hidden;
      }
    }

    .matches-slider-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 84px;

      .match-actions {
        display: flex;
        column-gap: 24px;
        align-items: center;

        .star-button {
          padding: 16px;
          border: 2px solid #0d2a38;

          &.active {
            border: 2px solid #184d6d;
            background: #184d6d;
            color: white;

            :hover {
              border: 2px solid #0d2a38;
              background: #0d2a38;
            }
          }

          :hover {
            border: 2px solid white;
            background-color: white;
          }
        }

        .remove-button {
          padding: 16px;
          border: 2px solid #b4263b;
          color: #b4263b;

          :hover {
            border: 2px solid white;
            background-color: white;
          }

          &:disabled {
            border: 2px solid #a7a7a7;
            color: #a7a7a7;
          }
        }

        .check-button {
          padding: 30px;
          border: 2px solid #184d6d;
          :hover {
            background-color: #0d2a38;
            color: white;
          }

          &.active {
            border: 2px solid #408140;
            background: #408140;
          }
        }
      }
    }
  }
`;
