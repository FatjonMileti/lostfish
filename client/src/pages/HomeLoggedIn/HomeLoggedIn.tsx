import React from 'react';
import { styled } from '@mui/system';

import { Header } from './Header';
import { Backdrop } from '../../components/Backdrop';
import { Footer } from '../Home/Footer';
import { SectionThree } from './HomeLoggedIn.SectionThree';
import { SectionFive } from './HomeLoggedIn.SectionFive';
import { SectionTwo as HomeLoggedOutSectionTwo } from '../About/About.SectionTwo';

import { Suggestions } from '../Suggestions/Suggestions';
import { FaqSection } from '../About/About.FaqSection';

import forestBackgroundImage from '../About/forest.jpeg';
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

      <Backdrop open={loading}></Backdrop>

      <div className='container'>
        <Suggestions />
        <HomeLoggedOutSectionTwo />
        <SectionFive />
        <SectionThree />
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
    z-index: 0;

    .header {
      z-index: 1;
    }

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
