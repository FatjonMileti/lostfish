import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { ArrowButton } from '../../../components/ArrowButton';
import { IconButton } from '../../../components/IconButton';
import { MatchedSlide, PropertyType } from './MatchesProperties';
import { Switch } from '../../../components/Switch';
import { useCriteriaStore } from '../../../globalState/criteria';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../../globalState/profile';

interface SuggestedMatchesProps extends HTMLAttributes<HTMLDivElement> {
  properties: PropertyType[];
  improveTrustScore: () => void;
  removePropertyMatch: (matchId: string, propertyId?: string) => void;
  starProperty: (propertyId: string, chosen: boolean, starred: boolean) => void;
  checkProperty: (propertyId: string, chosen: boolean, starred: boolean) => void;
  getProperties: () => void;
  showSwitchToMatchedViewSwitch: boolean;
  matchedView: boolean;
  setMatchedView: (matchedView: boolean) => void;
  setPropertyToView: (propertyToView: PropertyType) => void;
}
export const SuggestedMatches = styled(
  ({
    className,
    properties,
    improveTrustScore,
    removePropertyMatch,
    starProperty,
    checkProperty,
    getProperties,
    showSwitchToMatchedViewSwitch,
    matchedView,
    setMatchedView,
    setPropertyToView
  }: SuggestedMatchesProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);

    const suggestedMatch = properties[activeSlide];
    const property = suggestedMatch?.property;

    const criteriaStore = useCriteriaStore();

    const profileStore = useProfileStore();

    React.useEffect(() => {
      getProperties();
    }, []);

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % properties?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    return (
      <>
        <div className='page-title-section'>
          <div>
            <Typography>
              Matching with{' '}
              <span className='matching-with'>properties in {criteriaStore.areaOfInterest} +</span>
            </Typography>
            {properties.length === 0 ? (
              <Typography variant='body5' className='sub-title'>
                No matches. Enter more details to refine your search.
              </Typography>
            ) : (
              <Typography variant='body5' className='sub-title'>
                Displaying {properties.length} matches. Enter more details to refine your search.
              </Typography>
            )}
          </div>

          {((id: string) => (
            <div className='switch-to-matched-view-button-wrapper'>
              {showSwitchToMatchedViewSwitch && (
                <>
                  <label htmlFor={id}>Switch to matched view</label>
                  <Switch id={id} checked={matchedView} onChange={(e) => setMatchedView(e.target.checked)} />
                </>
              )}
            </div>
          ))(React.useId())}
        </div>
        <div className={classNames('matches-slider', className)}>
          <div className='matches-slider-body'>
            <div className='trust-score-section'>
              <Typography variant='body5' className='your-trust-score-text'>
                Your match score
              </Typography>
              <Typography variant='h3' className='trust-score'>
                {profileStore.trust_score}%
              </Typography>
              <Typography variant='body3' className='improve-trust-score-title'>
                Improve your match score and find better matches
              </Typography>
              <Typography variant='body4' className='trust-score-description'>
                Go through the steps below to improve your match score. Remember that you can’t close a
                certain deal without maximum match score.
              </Typography>

              <Label variant='tertiary' size='medium' className='improve-link' onClick={improveTrustScore}>
                Improve match score
                <Icon icon='arrow-right-1' size={16} />
              </Label>
            </div>
            <div className='slides-wrapper'>
              {properties.length === 0 && (
                <div className='no-matches'>
                  <Typography variant='body1'>
                    {`You haven’t got any new matches. 
                    [TO DO - Find better behaviour]`}
                  </Typography>
                </div>
              )}
              {properties.map((suggestedProperty, propertyIndex) => {
                const { property } = suggestedProperty;

                return (
                  <motion.div
                    key={propertyIndex}
                    animate={{
                      x:
                        propertyIndex < activeSlide
                          ? `calc(${-100 * propertyIndex}% - ${propertyIndex * 24}px)`
                          : `calc(${-100 * activeSlide}% - ${24 * activeSlide - propertyIndex}px)`,
                      scale: propertyIndex < activeSlide ? 0.9 : 1,
                      y: propertyIndex >= activeSlide ? `0` : `32px`,
                      opacity: propertyIndex === activeSlide ? 1 : 0.5
                    }}
                    transition={{ ease: 'easeOut', duration: 0.5 }}>
                    <MatchedSlide
                      className={classNames({ active: propertyIndex === activeSlide })}
                      image={`${property?.property_images?.[0].link || ''}`}
                      viewProperty={() => setPropertyToView(suggestedProperty)}
                      property={property}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
          {properties.length > 0 && (
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
                      removePropertyMatch(suggestedMatch?.matchId, property._id);
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
                    checkProperty(property._id, !suggestedMatch?.chosen, suggestedMatch.starred);
                  }}>
                  <Icon icon='checked' size={28} />
                </IconButton>

                <IconButton
                  size='large'
                  className={`star-button ${suggestedMatch?.starred ? 'active' : ''}`}
                  onClick={() => {
                    starProperty(property._id, suggestedMatch.chosen, !suggestedMatch.starred);
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
          )}
        </div>
      </>
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

        padding-top: 24px;
        margin-top: -24px;

        .no-matches {
          display: grid;
          align-items: center;
          justify-items: center;
          .typography {
            text-align: center;
            max-width: 60%;
            color: lightgray;
            font-family: Roobert, serif;
          }
        }
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
