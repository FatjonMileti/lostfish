import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../../components/Typography';

import { StarredMatchesTenants } from './StarredMatches.Tenants';
import { useProfileStore } from '../../../globalState/profile';
import { StarredMatchesProperties } from './StarredMatches.Properties';

export const StarredMatches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const profileStore = useProfileStore();
  return (
    <div className={`starred-matches ${className}`}>
      <div>
        <Typography variant='body1'>Starred matches</Typography>
        <Typography variant='body5' className='description'>
          You will only see starred matches from your current search.
        </Typography>
      </div>
      {profileStore.role === 'Landlord' && <StarredMatchesTenants />}
      {profileStore.role === 'Tenant' && <StarredMatchesProperties />}
    </div>
  );
})`
  &.starred-matches {
    display: grid;
    row-gap: 32px;
    .description {
      margin-top: 16px;
    }
  }
`;
