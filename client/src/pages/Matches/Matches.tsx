import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import React, { HTMLAttributes } from 'react';
import { MatchesProperties } from './MatchesProperties/MatchesProperties';
import { MatchesTenants } from './MatchesTenants/MatchesTenants';
import { useProfileStore } from '../../globalState/profile';

export const Matches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const profileStore = useProfileStore();

  return (
    <div className={`matches-page ${className}`}>
      <Header />
      <div className='page-body'>
        {profileStore.role === 'Tenant' && <MatchesProperties />}
        {profileStore.role === 'Landlord' && <MatchesTenants />}
      </div>
    </div>
  );
})`
  &.matches-page {
    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto;

    .page-body {
      padding: 24px 36px 36px 36px;
      display: grid;
    }
  }
`;
