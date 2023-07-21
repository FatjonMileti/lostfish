import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import React, { HTMLAttributes } from 'react';
import { ImageGallery } from './ImageGalery';
import { SetCriteria } from '../SetCriteria/SetCriteria';

import { useUser } from '../../context/UserProvider';
import { useLocation } from 'react-router-dom';
import { MatchesProperties } from './MatchesProperties/MatchesProperties';
import { MatchesTenants } from './MatchesTenants/MatchesTenants';
import { useCriteriaStore } from '../../globalState/criteria';

export const Matches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const criteriaStore = useCriteriaStore();
  const { state } = useLocation();

  /* Since now we change role on first steps and we redirect here
   * we make sure to get user ability with new role based on user selection
   * */
  const { getOne } = useUser();

  React.useEffect(() => {
    if (state && state.shouldGetUser) {
      getOne();
    }
  }, [state]);

  return (
    <div className={`matches-page ${className}`}>
      <Header />
      <div className='page-body'>
        {criteriaStore.lookingFor === 'I’m looking for a place' && <MatchesProperties />}
        {criteriaStore.lookingFor === 'I own a place' && <MatchesTenants />}
        <ImageGallery />
      </div>
      {/* <Footer /> */}
    </div>
  );
})`
  &.matches-page {
    //background: linear-gradient(90deg, #e8edf0 0%, #fce8ef 100%);
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
