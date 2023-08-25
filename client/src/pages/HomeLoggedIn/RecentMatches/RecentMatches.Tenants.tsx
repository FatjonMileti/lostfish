import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import { TenantMatch } from '../../PagesComponents/TenantMatch';
import { getAvatarFormIndex } from '../avatars';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { mapTenant } from '../../Matches/MatchesTenants/serializers';
import { ViewProfile } from '../../Matches/MatchesTenants/ViewProfile';

export const RecentMatchesTenants = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();

  const [tenantMatchProfileToView, setTenantMatchProfileToView] = React.useState<null | any>(null);
  const getStarredTenants = async () => {
    try {
      const { data } = await axios(userStore.auth.access_token).get('/api/match', {
        params: { pageSize: 8, page: 1 }
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
              key={tenantIndex}
              className='recent-match'
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
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: 16px;
    //overflow-x: hidden;
    box-sizing: border-box;
    align-self: stretch;
    margin-right: -36px;

    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;

    .recent-match {
      min-width: 232px;
      max-width: 232px;
    }
  }
`;
