import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';

import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import axios from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../globalState/user';

import { TenantMatch } from '../../PagesComponents/TenantMatch';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { ViewProfile } from '../../Matches/MatchesTenants/ViewProfile';
import { mapTenant } from '../../Matches/MatchesTenants/serializers';

export const DashboardStarredTenants = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const [tenantMatchProfileToView, setTenantMatchProfileToView] = React.useState<null | any>(null);

  const getStarredTenants = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: { starred: true, pageSize: 2, page: 1 }
      });

      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const tenantMatchesQuery = useQuery(['starred-tenants'], getStarredTenants, {
    refetchOnWindowFocus: false
  });

  const tenantMatches = (!tenantMatchesQuery.isLoading && tenantMatchesQuery.data) || [];

  const viewProfile = (tenantMatch: any) => {
    setTenantMatchProfileToView(mapTenant(tenantMatch));
  };

  return (
    <>
      <div className={classNames('dashboard-starred-tenants', className)}>
        <Typography className='title' variant='body4'>
          Recently starred tenants
        </Typography>

        <div className='tenants'>
          {tenantMatches.map((tenantMatch: any, i: number) => {
            const { tenant } = tenantMatch;
            return (
              <TenantMatch
                key={i}
                fullName={`${tenant.first_name} ${tenant.last_name}`}
                avatar={getAvatarFormIndex(tenant.avatar)}
                userId={tenant._id}
                viewProfile={() => viewProfile(tenantMatch)}
              />
            );
          })}
        </div>
      </div>
      {tenantMatchProfileToView && (
        <ViewProfile
          criteria={tenantMatchProfileToView.criteria}
          closeViewProfile={() => setTenantMatchProfileToView(null)}
        />
      )}
    </>
  );
})`
  &.dashboard-starred-tenants {
    display: grid;
    row-gap: 16px;
    grid-template-rows: min-content auto;

    grid-area: c;

    .title {
      font-size: 18px;
      font-weight: 700;
    }

    .tenants {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 24px;
    }
  }
`;
