import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Typography } from '../../../components/Typography';
import { useSuggestedTenants } from './useSuggestedTenants';
import { motion } from 'framer-motion';
import { MatchedSlide, TenantType } from './MatchesTenants';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from './ViewProfile';
import { ArrowButton } from '../../../components/ArrowButton';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';

interface MatchesTenantsProps extends HTMLAttributes<HTMLDivElement> {}
export const SuggestionsTenants = styled(({ className }: MatchesTenantsProps) => {
  const suggestedTenants = useSuggestedTenants();
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [tenantToView, setTenantToView] = React.useState<TenantType | null>(null);

  const suggestedTenant: TenantType = suggestedTenants.tenants[activeSlide];
  const matchedProperty = suggestedTenant?.property;

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % suggestedTenants.tenants?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  console.log('suggestedTenants: ', suggestedTenants);

  return (
    <>
      <div className={classNames('suggestions-tenants', className)}>
        <div className='section-header'>
          <Typography className='matching-with'>
            Matching with{' '}
            <span className='address'>renters in {matchedProperty?.area_of_interest ?? ''}</span>
          </Typography>
          {suggestedTenants.tenants.length === 0 ? (
            <Typography variant='body5' className='sub-title'>
              No matches. Enter more details to refine your search.
            </Typography>
          ) : (
            <Typography variant='body5' className='sub-title'>
              Displaying {suggestedTenants.tenants.length} matches. Enter more details to refine your search.
            </Typography>
          )}
        </div>

        <div className='slides-wrapper'>
          {suggestedTenants.tenants.map((tenant, tenantIndex) => {
            const { criteria: tenantCriteria } = tenant;

            return (
              <motion.div
                key={tenantIndex}
                animate={{
                  x: `${-100 * activeSlide}% `,
                  opacity: tenantIndex === activeSlide ? 1 : 0.5
                }}
                transition={{ ease: 'easeOut', duration: 0.5 }}>
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

        {suggestedTenants.tenants.length > 0 && (
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
                  // if (suggestedTenant?.matchId) {
                  //   removeTenantMatch(suggestedTenant?.matchId);
                  // }
                }}>
                <Icon icon='close' size={28} />
              </IconButton>

              <IconButton
                size='large'
                inverted
                className={`check-button ${suggestedTenant?.chosen ? 'active' : ''}`}
                onClick={() => {
                  // checkTenant(
                  //   criteria.tenantId,
                  //   !suggestedTenant.chosen,
                  //   suggestedTenant?.starred,
                  //   matchedProperty?._id
                  // );
                }}>
                <Icon icon='checked' size={28} />
              </IconButton>

              <IconButton
                className={`star-button ${suggestedTenant?.starred ? 'active' : ''}`}
                size='large'
                onClick={() => {
                  // starTenant(
                  //   criteria.tenantId,
                  //   suggestedTenant?.chosen,
                  //   !suggestedTenant.starred,
                  //   matchedProperty?._id
                  // );
                }}>
                <Icon icon='star-solid' size={28} />
              </IconButton>
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{ visibility: suggestedTenants.tenants.length === 1 ? 'hidden' : 'initial' }}
            />
          </div>
        )}
      </div>

      {tenantToView && (
        <ViewProfile criteria={tenantToView.criteria} closeViewProfile={() => setTenantToView(null)} />
      )}
    </>
  );
})`
  &.suggestions-tenants {
    min-height: calc(100vh - 112px);
    display: grid;
    grid-template-rows: min-content auto;
    align-content: space-between;
    row-gap: 32px;
    padding: 36px;
    box-sizing: border-box;
    justify-items: center;
    overflow-x: hidden;

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
      width: 440px;
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
