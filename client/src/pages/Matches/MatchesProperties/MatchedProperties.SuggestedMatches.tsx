import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { avatars } from '../../HomeLoggedIn/avatars';
import { ArrowButton } from '../../../components/ArrowButton';
import { IconButton } from '../../../components/IconButton';
import { MatchedSlide, PropertyType } from './MatchesProperties';
import { ViewProperty } from './ViewProperty';

interface SuggestedMatchesProps extends HTMLAttributes<HTMLDivElement> {
  properties: PropertyType[];
  improveTrustScore: () => void;
  setProperties: (properties: PropertyType[] | ((properties: PropertyType[]) => PropertyType[])) => void;
  removePropertyMatch: (propertyId: string, matchId: string) => void;
  starProperty: (propertyId: string, chosen: boolean) => void;
  checkProperty: (propertyId: string, starred: boolean) => void;
  getProperties: () => void;
}
export const SuggestedMatches = styled(
  ({
    className,
    properties,
    setProperties,
    improveTrustScore,
    removePropertyMatch,
    starProperty,
    checkProperty,
    getProperties
  }: SuggestedMatchesProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);

    const [viewPropertyModalVisibility, setViewPropertyModalVisibility] = React.useState(false);

    const suggestedMatch = properties[activeSlide];
    const property = suggestedMatch?.property;

    React.useEffect(() => {
      getProperties();
    }, []);

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
          images={property?.property_images.map(({ link }) => link) || []}
          avatar={
            !isNaN(parseInt(property?.created_by?.avatar || ''))
              ? avatars[parseInt(property?.created_by?.avatar || '')]?.image
              : ''
          }
          areaOfInterest={property?.area_of_interest || ''}
          numberOfBedrooms={property?.room_details?.number_of_bedrooms}
          rentingPrice={property?.asset_rent?.rental_amount}
          numberOfBathrooms={property?.room_details?.number_of_bathrooms}
          propertyOwnerName={`${property?.created_by?.first_name} ${property?.created_by?.last_name}`}
          propertyType={property?.property_type || ''}
          propertyArea={property?.floor_size}
          parkingSpot={(property?.specific_property_features || []).includes('Parking spot')}
          energyCertificate={(property?.contract_details || []).includes('energyCertificate')}
          address={{
            lat: property?.asset_address?.latitude,
            lng: property?.asset_address?.longitude
          }}
          refineYourSearchClick={() => {
            setViewPropertyModalVisibility(false);
          }}
          starProperty={() => starProperty(property._id, suggestedMatch.chosen)}
          isPropertyStarred={!!suggestedMatch?.starred}
        />
        <div className='matches-slider-body'>
          <div className='trust-score-section'>
            <Typography variant='body5' className='your-trust-score-text'>
              Your trust score
            </Typography>
            <Typography variant='h3' className='trust-score'>
              45%
            </Typography>
            <Typography variant='body3' className='improve-trust-score-title'>
              Improve your trust score and find better matches
            </Typography>
            <Typography variant='body4' className='trust-score-description'>
              Go through the steps below to improve your trust score. Remember that you can’t close a certain
              deal without maximum trust score.
            </Typography>

            <Label variant='tertiary' size='medium' className='improve-link' onClick={improveTrustScore}>
              Improve trust score
              <Icon icon='arrow-right-1' size={16} />
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
            <IconButton
              className='remove-button'
              size='large'
              onClick={() => {
                if (suggestedMatch?.matchId) {
                  removePropertyMatch(property._id, suggestedMatch?.matchId);
                }
              }}
              disabled={!suggestedMatch?.matchId}>
              <Icon icon='close' size={28} />
            </IconButton>

            <IconButton
              size='large'
              inverted
              className={`check-button ${suggestedMatch?.chosen ? 'active' : ''}`}
              onClick={() => {
                checkProperty(property._id, suggestedMatch.starred);
              }}>
              <Icon icon='checked' size={28} />
            </IconButton>

            <IconButton
              size='large'
              className={`star-button ${suggestedMatch?.starred ? 'active' : ''}`}
              onClick={() => {
                starProperty(property._id, suggestedMatch.chosen);
              }}>
              <Icon icon='star-solid' size={28} />
            </IconButton>
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

        .trust-score {
          margin-top: 4px;
          line-height: 64px;
          color: #e5155a;
          font-family: Roobert, serif;
          font-weight: 700;
        }

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

        .your-trust-score-text {
          line-height: 16px;
          color: #a7a7a7;
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
