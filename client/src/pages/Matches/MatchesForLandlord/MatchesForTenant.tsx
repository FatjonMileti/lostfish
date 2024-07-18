import { styled } from '@mui/system';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import { Footer } from '../../Home/Footer';

import { HeaderLoggedIn } from '../../PagesComponents/HeaderLoggedIn/HeaderLoggedIn.tsx';
import { SuggestionsTenants } from '../../Suggestions/SugestionsTenants/SuggestionsTenants.tsx';

interface MatchesForTenantProps extends HTMLAttributes<HTMLDivElement> {}

export const MatchesForLandlord = styled(({ className }: MatchesForTenantProps) => {
  return (
    <div className={classNames('matches-for-landlord', className)}>
      <div className='header-and-content-wrapper'>
        <HeaderLoggedIn />
        <SuggestionsTenants />
      </div>
      <Footer />
    </div>
  );
})`
  &.matches-for-landlord {
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto min-content;
    width: 100%;

    //background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), lightgray 50% / cover no-repeat;
    background: linear-gradient(180deg, #fffbf3 13.21%, #fff 51.66%), #fff;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      box-sizing: border-box;

      .header-logged-in {
        border: 1px solid #eee0d3;
      }
    }
  }
`;
