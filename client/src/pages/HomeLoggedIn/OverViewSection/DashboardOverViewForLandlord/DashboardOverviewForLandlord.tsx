import { DefaultState } from '../DefaultState.tsx';

import React, { useState } from 'react';

import { useProfileStore } from '../../../../globalState/profile.tsx';

import { States } from '../DashboardOverview.tsx';
import { Agreement } from '../Agreement.tsx';
import { MatchesAwaiting } from './MatchesAwaiting.tsx';
import { PerfectMatch } from './PerfectMatch.tsx';
import { useMatchedTenants } from '../../../Matches/MatchesTenants/useMatchedTenants.tsx';
import { MultiplePerfectMatches } from './MultiplePerfectMatches.tsx';
import { useSuggestedTenants } from '../../../Suggestions/SugestionsTenants/useSuggestedTenants.tsx';

interface DashboardOverviewForLandlordProps {}
export const DashboardOverviewForLandlord = ({}: DashboardOverviewForLandlordProps) => {
  const [state, setState] = useState<States>(States.MatchesAwaiting);

  const profileStore = useProfileStore();

  const matchedTenants = useMatchedTenants({
    params: { chosen: true },
    options: {
      refetchOnMount: true
    }
  });

  const suggestedTenants = useSuggestedTenants({
    params: { chosen: false, disliked: false },
    options: {
      refetchOnMount: true
    }
  });

  React.useEffect(() => {
    if (matchedTenants.isFetched && suggestedTenants.isFetched) {
      if (!profileStore.signed_transaction_agreement) {
        setState(States.Agreement);
        return;
      }

      if (matchedTenants.data?.length > 0) {
        if (matchedTenants.data?.length === 1) {
          setState(States.PerfectMatch);
        } else {
          setState(States.MultiplePerfectMatches);
        }
        return;
      }

      if (suggestedTenants.data.length > 0) {
        setState(States.MatchesAwaiting);
        return;
      }

      setState(States.Default);
    }
  }, [matchedTenants.isFetched, profileStore.signed_transaction_agreement]);

  return (
    <>
      {state === States.Default && <DefaultState />}
      {state === States.MatchesAwaiting && <MatchesAwaiting />}
      {state === States.PerfectMatch && <PerfectMatch match={matchedTenants.data[0]} />}
      {state === States.MultiplePerfectMatches && (
        <MultiplePerfectMatches count={matchedTenants.data.length} match={matchedTenants.data[0]} />
      )}
      {state === States.Agreement && <Agreement />}
      {/*{state === States.FinalDocs && <FinalDocs match={matchedProperties.data[0]} />}*/}
    </>
  );
};
