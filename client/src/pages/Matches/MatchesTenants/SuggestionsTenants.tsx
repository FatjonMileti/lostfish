import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Typography } from '../../../components/Typography';
import { useSuggestedTenants } from './useSuggestedTenants';
import { motion } from 'framer-motion';
import { TenantType } from './MatchesTenants';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from './ViewProfile';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchButton } from '../../../components/MatchButton';
import { UnMatchButton } from '../../../components/UnMatchButton';
import { TenantCard } from '../../../components/TenantCard';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';

interface MatchesTenantsProps extends HTMLAttributes<HTMLDivElement> {}
export const SuggestionsTenants = styled(({ className }: MatchesTenantsProps) => {
  const suggestedTenants = useSuggestedTenants();
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [tenantToView, setTenantToView] = React.useState<TenantType | null>(null);

  const userStore = useUserStore();

  const suggestedTenant: TenantType = suggestedTenants.tenants[activeSlide];
  const matchedProperty = suggestedTenant?.property;

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % suggestedTenants.tenants?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  console.log('suggestedTenants: ', suggestedTenants);

  const likeProperty = async ({ tenantId, propertyId }: { tenantId: string; propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/tenant', {
        tenant: tenantId,
        chosen: true,
        property: propertyId
      });
    } catch (err) {
      throw err;
    }
  };

  const dislikeProperty = async ({ matchId }: { matchId: string }) => {
    try {
      await axios(userStore.auth.access_token).delete(`/api/match/${matchId}`);
    } catch (err) {
      throw err;
    }
  };

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

        <motion.div className='slides-wrapper'>
          {suggestedTenants.tenants.map((tenant, tenantIndex) => {
            const { criteria: tenantCriteria } = tenant;

            return (
              <TenantCard
                key={tenantIndex}
                animate={{
                  x: `calc(${-100 * activeSlide}% - ${activeSlide * 24}px)`
                }}
                transition={{ duration: 0.4 }}
                name={`${tenantCriteria.firstName} ${tenantCriteria.lastName}`}
                avatar={getAvatarFormIndex(tenantCriteria.avatar)}
                inView={tenantIndex === activeSlide}
                percentage={matchedProperty.percentage}
                onViewProfileClick={() => setTenantToView(suggestedTenant)}
              />
            );
          })}
        </motion.div>

        {suggestedTenants.tenants.length > 0 && (
          <div className='matches-slider-footer'>
            <ArrowButton
              direction='left'
              onClick={previous}
              style={{ visibility: activeSlide === 0 ? 'hidden' : 'initial' }}
              size='large'
            />
            <div className='match-actions'>
              {/*<IconButton*/}
              {/*  className='remove-button'*/}
              {/*  size='large'*/}
              {/*  disabled={!suggestedTenant?.matchId}*/}
              {/*  onClick={() => {*/}
              {/*    // if (suggestedTenant?.matchId) {*/}
              {/*    //   removeTenantMatch(suggestedTenant?.matchId);*/}
              {/*    // }*/}
              {/*  }}>*/}
              {/*  <Icon icon='close' size={28} />*/}
              {/*</IconButton>*/}
              <UnMatchButton size='large' />
              {/*<IconButton*/}
              {/*  size='large'*/}
              {/*  inverted*/}
              {/*  className={`check-button ${suggestedTenant?.chosen ? 'active' : ''}`}*/}
              {/*  onClick={() => {*/}
              {/*    // checkTenant(*/}
              {/*    //   criteria.tenantId,*/}
              {/*    //   !suggestedTenant.chosen,*/}
              {/*    //   suggestedTenant?.starred,*/}
              {/*    //   matchedProperty?._id*/}
              {/*    // );*/}
              {/*  }}>*/}
              {/*  <Icon icon='checked' size={28} />*/}
              {/*</IconButton>*/}
              {/*<IconButton*/}
              {/*  className={`star-button ${suggestedTenant?.starred ? 'active' : ''}`}*/}
              {/*  size='large'*/}
              {/*  onClick={() => {*/}
              {/*    // starTenant(*/}
              {/*    //   criteria.tenantId,*/}
              {/*    //   suggestedTenant?.chosen,*/}
              {/*    //   !suggestedTenant.starred,*/}
              {/*    //   matchedProperty?._id*/}
              {/*    // );*/}
              {/*  }}>*/}
              {/*  <Icon icon='star-solid' size={28} />*/}
              {/*</IconButton>*/}
              <MatchButton size='large' />
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{
                visibility: activeSlide === suggestedTenants.tenants.length - 1 ? 'hidden' : 'initial'
              }}
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
      column-gap: 24px;
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
