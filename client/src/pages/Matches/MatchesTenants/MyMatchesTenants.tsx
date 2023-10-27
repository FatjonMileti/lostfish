import { styled } from '@mui/system';
import { Header } from '../../HomeLoggedIn/Header';
import classNames from 'classnames';
import { Backdrop } from '../../../components/Backdrop';
import React, { HTMLAttributes } from 'react';
import { TenantCard } from '../../../components/TenantCard';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from './ViewProfile';
import { SuggestedTenantType } from './MatchesTenants';
import { Footer } from '../../Home/Footer';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { useMatchesCount } from '../useMatchesCount';
import { useMatchedTenants } from './useMatchedTenants';

interface MyMatchesTenants extends HTMLAttributes<HTMLDivElement> {}

export const MyMatchesTenants = styled(({ className }: MyMatchesTenants) => {
  const matchedTenants = useMatchedTenants({ chosen: true });
  const [tenantToView, setTenantToView] = React.useState<SuggestedTenantType | null>(null);
  const navigate = useNavigate();
  const userStore = useUserStore();

  const matchesCount = useMatchesCount({ chosen: true });

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

      matchedTenants.reFetch();
      matchesCount.refetch();
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <Backdrop open={matchedTenants.loading}></Backdrop>
      <div className={classNames('my-matches-tenants', className)}>
        <div className='header-and-content-wrapper'>
          <Header />
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
              {matchedTenants.tenants.map((tenant, tenantIndex) => {
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
                    // matched={tenant.chosen}
                    awaitingMatch={tenant.chosen}
                    chatWith={() => {
                      console.log('tenant to chat: ', tenant);

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
