import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchedSlide, TenantType } from './MatchesTenants';
import { Switch } from '../../../components/Switch';
import { IconButton } from '../../../components/IconButton';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { useProfileStore } from '../../../globalState/profile';

interface AddedTenantsProps extends HTMLAttributes<HTMLDivElement> {
  tenants: TenantType[];
  getTenants: () => void;
  removeTenantMatch: (matchId: string, propertyId?: string) => Promise<void>;
  improveTrustScore: () => void;
  showSwitchToMatchedViewSwitch: boolean;
  matchedView: boolean;
  setMatchedView: (matchedView: boolean) => void;
  setTenantToView: (propertyToView: TenantType) => void;
  starTenant: (tenantId: string, chosen: boolean, starred: boolean, propertyId: string) => void;
  checkTenant: (tenantId: string, chosen: boolean, starred: boolean, propertyId: string) => void;
}
export const SuggestedTenants = styled(
  ({
    className,
    tenants,
    removeTenantMatch,
    getTenants,
    showSwitchToMatchedViewSwitch,
    matchedView,
    setMatchedView,
    setTenantToView,
    starTenant,
    checkTenant,
    improveTrustScore
  }: AddedTenantsProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const suggestedTenant: TenantType = tenants[activeSlide];
    const criteria = suggestedTenant?.criteria;
    const matchedProperty = suggestedTenant?.property;

    const profileStore = useProfileStore();

    React.useEffect(() => {
      getTenants();
    }, []);

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % tenants?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    useEffect(() => {
      if (tenants.length === 0) {
        setMatchedView(false);
      }
    }, [tenants.length]);

    return (
      <>
        <div className='page-title-section'>
          <div>
            <Typography>
              Matching with{' '}
              <span className='matching-with'>renters in {matchedProperty?.area_of_interest ?? ''} +</span>
            </Typography>
            <Typography variant='body5' className='sub-title'>
              Displaying 1240 matches. Enter more details to refine your search.
            </Typography>
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
                Your trust score
              </Typography>
              <Typography variant='h3' className='trust-score'>
                {profileStore.trust_score}%
              </Typography>
              <Typography variant='body3' className='improve-trust-score-title'>
                Improve your trust score and find better matches
              </Typography>
              <Typography variant='body4' className='trust-score-description'>
                Go through the steps below to improve your trust score. Remember that you can’t close a
                certain deal without maximum trust score.
              </Typography>

              <Label variant='tertiary' size='medium' className='improve-link' onClick={improveTrustScore}>
                Improve trust score
                <Icon icon='arrow-right-1' size={16} />
              </Label>
            </div>
            <div className='slides-wrapper'>
              {tenants.length === 0 && (
                <div className='no-matches'>
                  <Typography variant='body1'>You haven’t got any new matches.</Typography>
                </div>
              )}

              {tenants.map((addedTenant, tenantIndex) => {
                const { criteria: tenantCriteria } = addedTenant;

                return (
                  <motion.div
                    animate={{
                      x:
                        tenantIndex < activeSlide
                          ? `calc(${-100 * tenantIndex}% +  ${32 * tenantIndex}px) `
                          : `calc(${-100 * activeSlide}% + ${32 * activeSlide}px)`,

                      scale: tenantIndex < activeSlide ? 0.9 : 1,
                      y: tenantIndex >= activeSlide ? `0` : `32px`,
                      opacity: tenantIndex === activeSlide ? 1 : 0.5
                    }}
                    transition={{ ease: 'easeOut', duration: 0.5 }}
                    style={{ marginLeft: '-32px' }}>
                    <MatchedSlide
                      active={tenantIndex === activeSlide}
                      avatar={getAvatarFormIndex(tenantCriteria.avatar)}
                      name={`${tenantCriteria.firstName} ${tenantCriteria.lastName}`}
                      onViewProfileClick={() => setTenantToView(suggestedTenant)}
                      setActiveSlide={() => {}}
                      percentage={matchedProperty.percentage}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {tenants.length > 0 && (
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
                  disabled={!suggestedTenant?.matchId}
                  onClick={() => {
                    if (suggestedTenant?.matchId) {
                      removeTenantMatch(suggestedTenant?.matchId);
                    }
                  }}>
                  <Icon icon='close' size={28} />
                </IconButton>

                <IconButton
                  size='large'
                  inverted
                  className={`check-button ${suggestedTenant?.chosen ? 'active' : ''}`}
                  onClick={() => {
                    checkTenant(
                      criteria.tenantId,
                      !suggestedTenant.chosen,
                      suggestedTenant?.starred,
                      matchedProperty?._id
                    );
                  }}>
                  <Icon icon='checked' size={28} />
                </IconButton>

                <IconButton
                  className={`star-button ${suggestedTenant?.starred ? 'active' : ''}`}
                  size='large'
                  onClick={() => {
                    starTenant(
                      criteria.tenantId,
                      suggestedTenant?.chosen,
                      !suggestedTenant.starred,
                      matchedProperty?._id
                    );
                  }}>
                  <Icon icon='star-solid' size={28} />
                </IconButton>
              </div>
              <ArrowButton
                direction='right'
                onClick={next}
                size='large'
                style={{ visibility: tenants.length === 1 ? 'hidden' : 'initial' }}
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
      grid-template-columns: 1fr 2fr;
      column-gap: 24px;

      .trust-score-section {
        display: grid;
        align-content: center;
        max-width: 324px;

        .trust-score {
          margin-top: 4px;
          line-height: 64px;
          color: #e5155a;
          font-family: Roobert, serif;
          font-weight: 700;
        }

        .improve-trust-score-title {
          margin-top: 16px;
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
        display: flex;
        overflow-x: hidden;
        margin-right: -36px;
        padding-right: 36px;

        padding-left: calc(32px + 32px);
        margin-left: -32px;

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
