import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';

import { Icon, Label, PropertyCard, Typography, ShowGlobalLoading } from '../../../components';

import { ViewProperty } from '../MatchesProperties/ViewProperty.tsx';

import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { useCriteriaStore } from '../../../globalState/criteria';
import { useGlobalSetCriteria } from '../../SetCriteria/GlobalSetCriteria';

import { SuggestedPropertyType } from '../matches.type.ts';
import { useSuggestedProperties } from '../../Suggestions/SuggestionsProperties/useSuggestedProperties.tsx';
import { useMatchedProperties } from '../MatchesProperties/useMatchedProperties.tsx';

interface PotentialMatchesProps extends HTMLAttributes<HTMLDivElement> {}
export const PotentialMatches = styled(({ className }: PotentialMatchesProps) => {
  const suggestedProperties = useSuggestedProperties({
    params: { chosen: false },
    options: {
      refetchOnMount: true
    }
  });

  const matchedProperties = useMatchedProperties({ params: { chosen: true } });

  const criteriaStore = useCriteriaStore();
  const [activeSlide, setActiveSlide] = React.useState<number>(0);

  const [propertyToView, setPropertyToView] = React.useState<SuggestedPropertyType | null>(null);

  const userStore = useUserStore();

  const suggestedProperty: SuggestedPropertyType = suggestedProperties.data[activeSlide];

  const globalSetCriteria = useGlobalSetCriteria();

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % suggestedProperties.data?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  const likeProperty = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) => {
      return axios(userStore.auth.access_token).post('/api/match/properties', {
        property: propertyId
      });
    },
    onSuccess: () => {
      if (propertyToView) {
        setPropertyToView(null);
      }
      if (suggestedProperties.data.length - 1 === activeSlide && suggestedProperties.data.length > 1) {
        previous();
      }
      suggestedProperties.refetch();
      matchedProperties.refetch();
    }
  });

  const dislikeProperty = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) => {
      return axios(userStore.auth.access_token).post('/api/match/dislikes/properties', {
        property: propertyId
      });
    },
    onSuccess: () => {
      if (propertyToView) {
        setPropertyToView(null);
      }
      if (suggestedProperties.data.length - 1 === activeSlide && suggestedProperties.data.length > 1) {
        previous();
      }
      suggestedProperties.refetch();
    }
  });

  const onAdjustMatchPreferencesClick = () => {
    globalSetCriteria.openSetCriteria({
      afterSetCriteria: () => {
        suggestedProperties.refetch();
        criteriaStore.fetchCriteria(userStore.auth.access_token);
      }
    });
  };

  return (
    <>
      {(suggestedProperties.isFetching || likeProperty.isLoading || dislikeProperty.isLoading) && (
        <ShowGlobalLoading />
      )}
      <div className={classNames('potential-matches', className)}>
        <motion.div className='slides-wrapper'>
          {!suggestedProperties.isFetching && !suggestedProperties.data.length && (
            <div className='no-matches-card'>
              <div className='title-description'>
                <Icon icon='intersect' size={64} color='#E5155A' />
                <Typography variant='body2' className='title'>
                  Looking for more matches?
                </Typography>
                <Typography variant='body4' className='description'>
                  There are <span className='red-text'>28 available properties</span> that could be a perfect
                  match for you if you are looking to adapt your{' '}
                  <span className='black-text'>Budget Preferences.</span>
                </Typography>
              </div>
              <Label
                variant='secondary'
                size='large'
                className='action-button'
                onClick={onAdjustMatchPreferencesClick}>
                Adjust match preferences
              </Label>
            </div>
          )}

          {suggestedProperties.data.map((propertySuggestion, tenantIndex) => {
            const { property } = propertySuggestion;

            return (
              <PropertyCard
                key={tenantIndex}
                {...{
                  animate: {
                    x: `calc(${-760 * activeSlide}px - ${activeSlide * 24}px)`
                  },
                  transition: { duration: 0.4 }
                }}
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

        <div
          className='matches-slider-footer'
          style={{ visibility: !suggestedProperties.data.length ? 'hidden' : 'initial' }}>
          <Label variant='secondary' size='large' onClick={previous} disabled={activeSlide === 0}>
            <Icon icon='chevron-left' />
            Previous
          </Label>

          <Label
            variant='secondary'
            size='large'
            onClick={next}
            disabled={activeSlide === suggestedProperties.data.length - 1}>
            Next
            <Icon icon='chevron-right' />
          </Label>
        </div>
      </div>

      {propertyToView && (
        <ViewProperty
          open={true}
          closeModal={() => setPropertyToView(null)}
          onBackdropClick={() => setPropertyToView(null)}
          propertyMatch={propertyToView}
          dislikeProperty={() => dislikeProperty.mutate({ propertyId: propertyToView?.property._id })}
          likeProperty={() => likeProperty.mutate({ propertyId: propertyToView?.property._id })}
        />
      )}
    </>
  );
})`
  &.potential-matches {
    position: relative;
    display: grid;
    grid-template-rows: auto min-content;
    row-gap: 32px;
    box-sizing: border-box;
    justify-items: center;
    overflow-x: clip;

    align-content: center;

    .slides-wrapper {
      display: flex;
      column-gap: 24px;
      width: 800px;
      height: 540px;
      box-sizing: border-box;
      align-items: center;

      .no-matches-card {
        padding: 64px;
        width: 672px;
        height: 452px;
        box-sizing: border-box;
        border-radius: 12px;
        flex-shrink: 0;
        display: grid;
        justify-items: center;
        row-gap: 48px;

        border: 2px solid #eee0d3;
        background: #f7f1e7;
        /* Nav Shadow */
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);

        .title-description {
          display: grid;
          justify-items: center;
          row-gap: 24px;

          .title,
          .description {
            text-align: center;
          }

          .description {
            .red-text,
            .black-text {
              font-weight: 700;
            }
            .red-text {
              color: #e5155a;
            }
            .black-text {
              color: #000;
            }
          }

          .title {
            .highlighted {
              color: #e5155a;
            }
          }
        }
        .action-button {
          padding: 20px 32px;
        }
      }
    }

    .matches-slider-footer {
      width: 100%;
      padding: 24px 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 24px;
      user-select: none;

      .label {
        width: 164px;
      }
    }
  }
`;
