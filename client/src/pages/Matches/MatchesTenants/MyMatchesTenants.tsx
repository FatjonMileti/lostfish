import { styled } from '@mui/system';
import { Header } from '../../HomeLoggedIn/Header';
import classNames from 'classnames';
import { Backdrop } from '../../../components/Backdrop';
import React, { HTMLAttributes } from 'react';
import { TenantCard } from '../../../components/TenantCard';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from './ViewProfile';
import { Footer } from '../../Home/Footer';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { useMatchesCount } from '../useMatchesCount';
import { useMatchedTenants } from './useMatchedTenants';
import { TenantsReviewHeader } from './TenantsReviewHeader';
import { useSuggestedTenants } from '../../Suggestions/SugestionsTenants/useSuggestedTenants';
import { SuggestedTenantType } from '../matches.type';

interface MyMatchesTenants extends HTMLAttributes<HTMLDivElement> {}

export const MyMatchesTenants = styled(({ className }: MyMatchesTenants) => {
  const matchedTenants = useMatchedTenants({
    params: { chosen: true },
    options: {
      refetchOnMount: true
    }
  });
  const [tenantToView, setTenantToView] = React.useState<SuggestedTenantType | null>(null);
  const navigate = useNavigate();
  const userStore = useUserStore();

  const matchesCount = useMatchesCount({
    params: { chosen: true, disliked: false }
  });

  const suggestedTenants = useSuggestedTenants({
    params: { chosen: false, disliked: false }
  });

  const chatWith = ({ userId, propertyId }: { userId: string; propertyId: string }) => {
    try {
      navigate(`/messages?userId=${userId}`, { state: { propertyId } });
    } catch (err) {}
  };

  const dislikeTenant = async ({ matchId }: { matchId: string }) => {
    try {
      await axios(userStore.auth.access_token).delete(`/api/match/${matchId}`);
      if (tenantToView) {
        setTenantToView(null);
      }
      matchedTenants.refetch();
      matchesCount.refetch();
      suggestedTenants.refetch();
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <Backdrop open={matchedTenants.isFetching}></Backdrop>
      <div className={classNames('my-matches-tenants', className)}>
        <div className='header-and-content-wrapper'>
          <Header
            middleContent={
              <>
                <TenantsReviewHeader />
              </>
            }
          />
          <div className='content-wrapper'>
            <div className='content-header'>
              <div className='header-left-content'>
                <Typography>My matches</Typography>
                <Typography variant='body5'>
                  Here you can find all your matches as well as people/locations you are already matched with.
                </Typography>
              </div>

              <Label variant='secondary' className='filters-button'>
                <Icon icon='filter' />
                Filter matches
              </Label>
            </div>

            <div className='content'>
              {matchedTenants.data.map((tenant, tenantIndex) => {
                const { criteria: tenantCriteria } = tenant;

                return (
                  <TenantCard
                    key={tenantIndex}
                    transition={{ duration: 0.4 }}
                    name={`${tenantCriteria.firstName} ${tenantCriteria.lastName}`}
                    avatar={getAvatarFormIndex(tenantCriteria.avatar)}
                    inView={true}
                    percentage={tenant?.property.percentage}
                    onViewProfileClick={() => setTenantToView(tenant)}
                    matched={tenant.matched}
                    awaitingMatch={tenant.chosen && !tenant.matched}
                    chatWith={() => {
                      chatWith({
                        userId: tenant.criteria.tenantId,
                        propertyId: tenant.property._id
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {tenantToView && (
        <ViewProfile
          criteria={tenantToView.criteria}
          closeViewProfile={() => setTenantToView(null)}
          dislikeTenant={() => dislikeTenant({ matchId: tenantToView?.matchId || '' })}
          disableLikeTenant
        />
      )}
    </>
  );
})`
  &.my-matches-tenants {
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto min-content;
    width: 100%;

    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), lightgray 50% / cover no-repeat;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      box-sizing: border-box;

      .content-wrapper {
        padding: 36px;
        display: grid;
        grid-template-rows: min-content auto;
        row-gap: 48px;
        box-sizing: border-box;

        .content-header {
          display: flex;
          justify-content: space-between;
          column-gap: 24px;
          align-items: center;
          box-sizing: border-box;

          .header-left-content {
            display: grid;
            row-gap: 8px;
          }

          .filters-button {
            display: flex;
            column-gap: 8px;
            padding: 16px 20px;
            height: 56px;
          }
        }

        .content {
          min-height: calc(100vh - 112px);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          box-sizing: border-box;

          gap: 24px;
          justify-items: center;
          justify-self: center;
          align-content: flex-start;
        }
      }
    }
  }
`;
