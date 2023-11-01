import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchButton } from '../../../components/MatchButton';
import { UnMatchButton } from '../../../components/UnMatchButton';
import { Backdrop } from '../../../components/Backdrop';

import { useSuggestedProperties } from './useSuggestedProperties';
import { useMatchesCount } from '../../Matches/useMatchesCount';
import { ViewProperty } from '../../Matches/MatchesProperties/ViewProperty';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';

import { SuggestedPropertyType } from '../../Matches/MatchesProperties/MatchesProperties';
import { PropertyCard } from '../../../components/PropertyCard';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';

import forestBackgroundImage from '../../About/forest.jpeg';
interface SuggestionsPropertiesProps extends HTMLAttributes<HTMLDivElement> {}
export const SuggestionsProperties = styled(({ className }: SuggestionsPropertiesProps) => {
  const suggestedProperties = useSuggestedProperties({
    params: { disliked: false, chosen: false },
    options: {
      refetchOnMount: true
    }
  });
  const [activeSlide, setActiveSlide] = React.useState<number>(0);

  const [propertyToView, setPropertyToView] = React.useState<SuggestedPropertyType | null>(null);

  const userStore = useUserStore();

  const suggestedProperty: SuggestedPropertyType = suggestedProperties.data[activeSlide];

  const matchedProperty = suggestedProperty?.property;

  const matchesCount = useMatchesCount({
    params: { chosen: false, disliked: false }
  });

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % suggestedProperties.data?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  const likeProperty = async ({ propertyId }: { propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/properties', {
        property: propertyId
      });

      if (propertyToView) {
        setPropertyToView(null);
      }

      if (suggestedProperties.data.length - 1 === activeSlide && suggestedProperties.data.length > 1) {
        previous();
      }
      await suggestedProperties.refetch();
      matchesCount.refetch();
    } catch (err) {
      throw err;
    }
  };

  const dislikeProperty = async ({ propertyId }: { propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/dislikes/properties', {
        property: propertyId
      });

      if (propertyToView) {
        setPropertyToView(null);
      }

      if (suggestedProperties.data.length - 1 === activeSlide && suggestedProperties.data.length > 1) {
        previous();
      }
      await suggestedProperties.refetch();
      matchesCount.refetch();
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <Backdrop open={suggestedProperties.isFetching}></Backdrop>
      <div className={classNames('suggestions-properties', className)}>
        <div className='section-header'>
          <Typography className='matching-with'>
            Matching with{' '}
            <span className='address'>properties in {matchedProperty?.area_of_interest ?? ''}</span>
          </Typography>
          {suggestedProperties.data.length === 0 ? (
            <Typography variant='body5' className='sub-title'>
              No matches. Enter more details to refine your search.
            </Typography>
          ) : (
            <Typography variant='body5' className='sub-title'>
              Displaying {suggestedProperties.data.length} matches. Enter more details to refine your search.
            </Typography>
          )}
        </div>

        <motion.div className='slides-wrapper'>
          {suggestedProperties.data.map((propertySuggestion, tenantIndex) => {
            const { property } = propertySuggestion;

            return (
              <PropertyCard
                key={tenantIndex}
                animate={{
                  x: `calc(${-100 * activeSlide}% - ${activeSlide * 24}px)`
                }}
                transition={{ duration: 0.4 }}
                name={`${property.created_by?.first_name} ${property.created_by?.last_name}`}
                avatar={getAvatarFormIndex(property.created_by?.avatar)}
                inView={tenantIndex === activeSlide}
                percentage={property.percentage}
                onViewPropertyClick={() => setPropertyToView(suggestedProperty)}
                image={`${property?.property_images?.[0]?.link || ''}`}
                size='large'
                property={property}
              />
            );
          })}
        </motion.div>

        {suggestedProperties.data.length > 0 && (
          <div className='matches-slider-footer'>
            <ArrowButton
              direction='left'
              onClick={previous}
              style={{ visibility: activeSlide === 0 ? 'hidden' : 'initial' }}
              size='large'
            />
            <div className='match-actions'>
              <UnMatchButton
                size='large'
                onClick={() => {
                  dislikeProperty({
                    propertyId: suggestedProperty.property._id
                  });
                }}
              />
              <MatchButton
                size='large'
                onClick={() => {
                  likeProperty({
                    propertyId: suggestedProperty.property._id
                  });
                }}
              />
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{
                visibility: activeSlide === suggestedProperties.data.length - 1 ? 'hidden' : 'initial'
              }}
            />
          </div>
        )}
      </div>

      {propertyToView && (
        <ViewProperty
          open={true}
          starProperty={() => {}}
          closeModal={() => setPropertyToView(null)}
          onBackdropClick={() => setPropertyToView(null)}
          propertyToView={propertyToView}
          likeProperty={() => likeProperty({ propertyId: propertyToView?.property._id })}
        />
      )}
    </>
  );
})`
  &.suggestions-properties {
    position: relative;
    min-height: calc(100vh - 112px);
    display: grid;
    grid-template-rows: min-content auto;
    align-content: space-between;
    row-gap: 32px;
    padding: 36px;
    box-sizing: border-box;
    justify-items: center;
    overflow-x: clip;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 251, 243, 0.9) 20%, rgba(255, 255, 255, 0.9) 100%)
        no-repeat;
      z-index: -1;
      top: -112px;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${forestBackgroundImage});
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.4;
      z-index: -2;
      top: -112px;
    }

    .section-header {
      display: grid;
      row-gap: 8px;
      align-items: center;
      justify-self: center;
      justify-items: center;

      .matching-with {
        font-family: Roobert, serif;
        font-size: 18px;
        line-height: 24px;
        font-weight: 700;
        .address {
          color: #184d6d;
        }
      }

      .sub-title {
        margin-top: 8px;
      }
    }

    .slides-wrapper {
      display: flex;
      column-gap: 24px;
      width: 672px;
      box-sizing: border-box;

      .no-matches {
        display: grid;
        align-items: center;
        justify-items: center;
        width: 100%;
      }
    }

    .matches-slider-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 84px;
      user-select: none;

      .match-actions {
        display: flex;
        column-gap: 48px;
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
