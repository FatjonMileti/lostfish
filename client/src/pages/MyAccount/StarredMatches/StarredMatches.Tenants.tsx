import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { TenantMatch } from '../../PagesComponents/TenantMatch';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { mapTenant } from '../../Matches/MatchesTenants/serializers';
import { ViewProfile } from '../../Matches/MatchesTenants/ViewProfile';

export const StarredMatchesTenants = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();

  const [tenantMatchProfileToView, setTenantMatchProfileToView] = React.useState<null | any>(null);
  const getStarredTenants = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: { starred: true, pageSize: 10, page: 1 }
      });
      return data.docs;
    } catch (err) {
      throw err;
    }
  };

  const tenantMatchesQuery = useQuery(['starred-tenants'], getStarredTenants, {
    refetchOnWindowFocus: false
  });

  const viewProfile = (tenantMatch: any) => {
    setTenantMatchProfileToView(mapTenant(tenantMatch));
  };

  const tenantMatches = (!tenantMatchesQuery.isLoading && tenantMatchesQuery.data) || [];

  return (
    <>
      <div className={classNames('tenants', className)}>
        {tenantMatches.map((match: any, tenantIndex: number) => {
          const { tenant } = match;
          if (!tenant) return null;
          return (
            <TenantMatch
              fullName={`${tenant.first_name} ${tenant.last_name}`}
              userId={tenant._id}
              avatar={getAvatarFormIndex(tenant.avatar)}
              viewProfile={() => viewProfile(match)}
            />
          );
        })}
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
  &.tenants {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 24px;
    row-gap: 24px;
  }
`;
