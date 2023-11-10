import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Typography } from '../../../components/Typography';
import { useSuggestedTenants } from './useSuggestedTenants';
import { motion } from 'framer-motion';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from '../../Matches/MatchesTenants/ViewProfile';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchButton } from '../../../components/MatchButton';
import { UnMatchButton } from '../../../components/UnMatchButton';
import { TenantCard } from '../../../components/TenantCard';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { Backdrop } from '../../../components/Backdrop';
import { useMatchesCount } from '../../Matches/useMatchesCount';

import forestBackgroundImage from '../../Home/forest.jpeg';
import { EditPropertyModal } from '../../Properties/NewProperty/EditPropertyModal';
import { SuggestedTenantType } from '../../Matches/matches.type';

interface MatchesTenantsProps extends HTMLAttributes<HTMLDivElement> {}
export const SuggestionsTenants = styled(({ className }: MatchesTenantsProps) => {
  const suggestedTenants = useSuggestedTenants({
    params: { chosen: false, disliked: false },
    options: {
      refetchOnMount: true
    }
  });

  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [tenantToView, setTenantToView] = React.useState<SuggestedTenantType | null>(null);
  const [propertyToEdit, setPropertyToEdit] = React.useState<string | undefined>();

  const userStore = useUserStore();

  const suggestedTenant: SuggestedTenantType = suggestedTenants.data[activeSlide];
  const matchedProperty = suggestedTenant?.property;

  const matchesCount = useMatchesCount({
    params: { chosen: true, disliked: false }
  });

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % suggestedTenants.data?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  const likeTenant = async ({ tenantId, propertyId }: { tenantId: string; propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/tenants', {
        tenant: tenantId,
        property: propertyId
      });

      if (tenantToView) {
        setTenantToView(null);
      }

      if (suggestedTenants.data.length - 1 === activeSlide && suggestedTenants.data.length > 1) {
        previous();
      }
      await suggestedTenants.refetch();
      matchesCount.refetch();
    } catch (err) {
      throw err;
    }
  };

  const dislikeTenant = async ({ tenantId, propertyId }: { tenantId: string; propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/dislikes/tenants', {
        tenant: tenantId,
        property: propertyId
      });

      if (tenantToView) {
        setTenantToView(null);
      }

      if (suggestedTenants.data.length - 1 === activeSlide && suggestedTenants.data.length > 1) {
        previous();
      }
      await suggestedTenants.refetch();
      matchesCount.refetch();
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <Backdrop open={suggestedTenants.isFetching}></Backdrop>
      <div className={classNames('suggestions-tenants', className)}>
        <div className='section-header'>
          <Typography className='matching-with'>
            Matching with{' '}
            <span className='address'>
              renters in{' '}
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setPropertyToEdit(matchedProperty._id);
                }}>
                {matchedProperty?.area_of_interest ?? ''}
              </span>
            </span>
          </Typography>
          {suggestedTenants.data.length === 0 ? (
            <Typography variant='body5' className='sub-title'>
              No matches. Enter more details to refine your search.
            </Typography>
          ) : (
            <Typography variant='body5' className='sub-title'>
              Displaying {suggestedTenants.data.length} matches. Enter more details to refine your search.
            </Typography>
          )}
        </div>

        <motion.div className='slides-wrapper'>
          {suggestedTenants.data.map((tenant, tenantIndex) => {
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
                size='large'
              />
            );
          })}
        </motion.div>

        {suggestedTenants.data.length > 0 && (
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
                  dislikeTenant({
                    propertyId: suggestedTenant.property._id,
                    tenantId: suggestedTenant.criteria.tenantId
                  });
                }}
              />
              <MatchButton
                size='large'
                onClick={() => {
                  likeTenant({
                    propertyId: suggestedTenant.property._id,
                    tenantId: suggestedTenant.criteria.tenantId
                  });
                }}
              />
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{
                visibility: activeSlide === suggestedTenants.data.length - 1 ? 'hidden' : 'initial'
              }}
            />
          </div>
        )}
      </div>

      {tenantToView && (
        <ViewProfile
          criteria={tenantToView.criteria}
          closeViewProfile={() => setTenantToView(null)}
          likeTenant={() => {
            likeTenant({
              propertyId: tenantToView.property._id,
              tenantId: tenantToView.criteria.tenantId
            });
          }}
          dislikeTenant={() => {
            dislikeTenant({
              propertyId: tenantToView.property._id,
              tenantId: tenantToView.criteria.tenantId
            });
          }}
        />
      )}

      {propertyToEdit && (
        <EditPropertyModal
          propertyId={propertyToEdit}
          showStore={[!!propertyToEdit, () => setPropertyToEdit(undefined)]}
          afterSaveAsDraft={() => suggestedTenants.refetch()}
          onBack={() => setPropertyToEdit(undefined)}
          afterDelete={() => suggestedTenants.refetch()}
          afterStartMatching={async () => {
            await suggestedTenants.refetch();
          }}
        />
      )}
    </>
  );
})`
  &.suggestions-tenants {
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
