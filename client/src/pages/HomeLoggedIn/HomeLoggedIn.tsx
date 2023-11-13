import React from 'react';
import { styled } from '@mui/system';

import { Header } from './Header';
import { ShowGlobalLoading } from '../../components/ShowGlobalLoading';
import { Footer } from '../Home/Footer';
import { DailyNews } from '../Home/Home.DailyNews';
import { ColoredCards } from '../Home/Home.ColoredCards';
import { SectionTwo as HomeLoggedOutSectionTwo } from '../Home/Home.SectionTwo';

import { Suggestions } from '../Suggestions/Suggestions';
import { FaqSection } from '../Home/Home.FaqSection';

import { PropertiesMatchingHeader } from '../Matches/MatchesProperties/PropertiesMatchingHeader';
import { TenantsMatchingHeader } from '../Matches/MatchesTenants/TenantsMatchingHeader';
import { Role } from '../../enums';
import { useProfileStore } from '../../globalState/profile';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const profileStore = useProfileStore();

  return (
    <div className={`home-logged-in-page ${className}`}>
      <Header
        middleContent={
          <>
            {profileStore.role === Role.Landlord && <TenantsMatchingHeader />}
            {profileStore.role === Role.Client && <PropertiesMatchingHeader />}
          </>
        }
      />

      {loading && <ShowGlobalLoading />}

      <div className='container'>
        <Suggestions />
        <HomeLoggedOutSectionTwo />
        <ColoredCards />
        <DailyNews />
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
})`
  &.home-logged-in-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto min-content;
    box-sizing: border-box;

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
