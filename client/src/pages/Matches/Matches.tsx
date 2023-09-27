import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import React, { HTMLAttributes } from 'react';
import { MatchesProperties } from './MatchesProperties/MatchesProperties';
import { MatchesTenants } from './MatchesTenants/MatchesTenants';
import { useProfileStore } from '../../globalState/profile';
import backgroundImg from '../Home/home-background.png';

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
    //background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto;

    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      opacity: 0.05;
      background: url(${backgroundImg});
      background-size: cover;
      //background-position-x: left;
      //background-position-y: bottom;
      background-repeat: no-repeat;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;

      background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
      //background-position-y: bottom;
      background-size: cover;
      z-index: -2;
    }

    .page-body {
      padding: 24px 36px 36px 36px;
      display: grid;
    }
  }
`;
