import React from 'react';
import { styled } from '@mui/system';
import { HeaderLoggedIn } from '../PagesComponents/HeaderLoggedIn/HeaderLoggedIn.tsx';
import { Footer } from '../Home/Footer';

// import { Suggestions } from '../Suggestions/Suggestions';
import { PropertiesMatchingHeader } from '../Matches/MatchesProperties/PropertiesMatchingHeader';
import { TenantsMatchingHeader } from '../Matches/MatchesTenants/TenantsMatchingHeader';
import { Role } from '../../enums';
import { useProfileStore } from '../../globalState/profile';
import { ShareAndEarnSection } from './ShareAndEarnSection.tsx';
import { DailyNewss } from '../PagesComponents/DailyNews/DailyNews.tsx';
import { ValpalSection } from '../PagesComponents/ValpalSection/Home.ValpalSection.tsx';
import { InitialSetupModal } from '../InitialSetup/InitialSetupModal/InitialSetupModal.tsx';
import { MyDashboard } from '../AgentDashboard/MyDashboard.tsx';

export const HomeLoggedIn = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const profileStore = useProfileStore();

  if (profileStore.role === Role.Agent) {
    return <MyDashboard />;
  }

  if (!profileStore.has_completed_initial_setup) {
    return <InitialSetupModal />;
  }

  return (
    <div className={`home-logged-in-page ${className}`}>
      <HeaderLoggedIn
        middleContent={
          <>
            {profileStore.role === Role.Landlord && <TenantsMatchingHeader />}
            {profileStore.role === Role.Tenant && <PropertiesMatchingHeader />}
          </>
        }
      />

      {/*{loading && <ShowGlobalLoading />}*/}

      <div className='container'>
        {/*<Suggestions />*/}
        {/*<HomeLoggedOutSectionTwo />*/}
        <ValpalSection />
        <DailyNewss />
        <ShareAndEarnSection />
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

    .header-logged-in {
      border: 1px solid #eee0d3;
    }

    .container {
      display: grid;
      box-sizing: border-box;
    }
  }
`;
