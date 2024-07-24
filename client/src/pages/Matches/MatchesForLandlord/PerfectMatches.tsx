import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { TenantCard, ShowGlobalLoading, Icon, Label } from '../../../components';

import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { MatchedTenantType, SuggestedTenantType } from '../matches.type.ts';
import { ViewProfile } from '../MatchesTenants/ViewProfile.tsx';
import { EditPropertyModal } from '../../Properties/NewProperty/EditPropertyModal';

import { useMatchedTenants } from '../MatchesTenants/useMatchedTenants.tsx';
import { useNavigate } from 'react-router-dom';

interface PerfectMatchesProps extends HTMLAttributes<HTMLDivElement> {}
export const PerfectMatches = styled(({ className }: PerfectMatchesProps) => {
  const matchedTenants = useMatchedTenants({
    params: { chosen: true },
    options: {
      refetchOnMount: true
    }
  });

  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [tenantToView, setTenantToView] = React.useState<SuggestedTenantType | null>(null);
  const [propertyToEdit, setPropertyToEdit] = React.useState<string | undefined>();

  const navigate = useNavigate();
  const userStore = useUserStore();

  const suggestedTenant: MatchedTenantType = matchedTenants.data[activeSlide];
  const matchedProperty = suggestedTenant?.property;

  const next = () =>
    setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % matchedTenants.data?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  const likeTenant = useMutation({
    mutationFn: ({ tenantId, propertyId }: { tenantId: string; propertyId: string }) => {
      return axios(userStore.auth.access_token).post('/api/match/tenants', {
        tenant: tenantId,
        property: propertyId
      });
    },
    onSuccess: () => {
      if (tenantToView) {
        setTenantToView(null);
      }
      if (matchedTenants.data.length - 1 === activeSlide && matchedTenants.data.length > 1) {
        previous();
      }
      matchedTenants.refetch();
    }
  });

  const dislikeTenant = useMutation({
    mutationFn: ({ tenantId, propertyId }: { tenantId: string; propertyId: string }) => {
      return axios(userStore.auth.access_token).post('/api/match/dislikes/tenants', {
        tenant: tenantId,
        property: propertyId
      });
    },
    onSuccess: () => {
      if (tenantToView) {
        setTenantToView(null);
      }
      if (matchedTenants.data.length - 1 === activeSlide && matchedTenants.data.length > 1) {
        previous();
      }
      matchedTenants.refetch();
    }
  });

  const chatWith = async (matchId: string) => {
    navigate(`/messages?matchId=${matchId}`);
  };

  return (
    <>
      {(matchedTenants.isFetching || dislikeTenant.isLoading || likeTenant.isLoading) && (
        <ShowGlobalLoading />
      )}
      <div className={classNames('perfect-matches', className)}>
        <motion.div className='slides-wrapper'>
          {matchedTenants.data.map((tenant, tenantIndex) => {
            const motionProps = {
              animate: {
                x: `calc(${-100 * activeSlide}% - ${activeSlide * 24}px)`
              },
              transition: {
                duration: 0.4
              }
            };

            return (
              <TenantCard
                key={tenantIndex}
                name={`${tenant.criteria.firstName} ${tenant.criteria.lastName}`}
                avatar={getAvatarFormIndex(tenant.criteria.avatar)}
                inView={true}
                percentage={tenant.property.percentage}
                onViewProfileClick={() => setTenantToView(tenant)}
                matched={tenant.matched}
                awaitingMatch={tenant.chosen && !tenant.matched}
                chatWith={() => chatWith(tenant._id)}
                size='large'
                {...motionProps}
              />
            );
          })}
        </motion.div>

        {matchedTenants.data.length > 0 && (
          <div className='matches-slider-footer'>
            <Label variant='secondary' size='large' onClick={previous} disabled={activeSlide === 0}>
              <Icon icon='chevron-left' />
              Previous
            </Label>

            <Label
              variant='secondary'
              size='large'
              onClick={next}
              disabled={activeSlide === matchedTenants.data.length - 1}>
              Next
              <Icon icon='chevron-right' />
            </Label>
          </div>
        )}
      </div>

      {tenantToView && (
        <ViewProfile
          criteria={tenantToView.criteria}
          matchRate={matchedProperty.percentage}
          closeViewProfile={() => setTenantToView(null)}
          likeTenant={() => {
            likeTenant.mutate({
              propertyId: tenantToView.property._id,
              tenantId: tenantToView.criteria.tenantId
            });
          }}
          dislikeTenant={() => {
            dislikeTenant.mutate({
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
          afterSaveAsDraft={() => matchedTenants.refetch()}
          onBack={() => setPropertyToEdit(undefined)}
          afterDelete={() => matchedTenants.refetch()}
          afterStartMatching={async () => {
            await matchedTenants.refetch();
          }}
        />
      )}
    </>
  );
})`
  &.perfect-matches {
    position: relative;
    min-height: calc(100vh - 112px);
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
