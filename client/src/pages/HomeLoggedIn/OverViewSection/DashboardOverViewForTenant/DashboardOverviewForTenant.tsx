import { DefaultState } from './DefaultState.tsx';
import { MatchesAwaiting } from './MatchesAwaiting.tsx';
import { States } from '../DashboardOverview.tsx';
import { PerfectMatch } from './PerfectMatch.tsx';
import { useMatchedProperties } from '../../../Matches/MatchesProperties/useMatchedProperties.tsx';
import React, { useState } from 'react';
import { MultiplePerfectMatches } from './MultiplePerfectMatches.tsx';
import { Agreement } from './Agreement.tsx';
import { FinalDocs } from './FinalDocs.tsx';
import { useProfileStore } from '../../../../globalState/profile.tsx';

interface DashboardOverviewForTenantProps {}
export const DashboardOverviewForTenant = ({}: DashboardOverviewForTenantProps) => {
  const [state, setState] = useState<States>(States.Default);

  const profileStore = useProfileStore();

  const matchedProperties = useMatchedProperties({
    params: { chosen: true },
    options: {
      refetchOnMount: true
    }
  });

  React.useEffect(() => {
    if (matchedProperties.isFetched) {
      if (!profileStore.signed_transaction_agreement) {
        setState(States.Agreement);
        return;
      }

      if (matchedProperties.data?.length > 0) {
        if (matchedProperties.data?.length === 1) {
          setState(States.PerfectMatch);
        } else {
          setState(States.MultiplePerfectMatches);
        }
        return;
      }

      setState(States.Default);
    }
  }, [matchedProperties.isFetched, profileStore.signed_transaction_agreement]);

  return (
    <>
      {state === States.Default && <DefaultState />}
      {state === States.MatchesAwaiting && <MatchesAwaiting />}
      {state === States.PerfectMatch && <PerfectMatch match={matchedProperties.data[0]} />}
      {state === States.MultiplePerfectMatches && (
        <MultiplePerfectMatches count={matchedProperties.data.length} match={matchedProperties.data[0]} />
      )}
      {state === States.Agreement && <Agreement />}
      {state === States.FinalDocs && <FinalDocs match={matchedProperties.data[0]} />}
    </>
  );
};
