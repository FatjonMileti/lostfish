import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';

import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { RecentMatchesTenants } from './RecentMatches/RecentMatches.Tenants';
import { useProfileStore } from '../../globalState/profile';
import { RecentMatchesProperties } from './RecentMatches/RecentMatches.Properties';

export const SectionFour = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();
  const profileStore = useProfileStore();

  return (
    <div className={className}>
      <div className='title'>
        <Typography>Your recent matches</Typography>
      </div>
      {profileStore.role === 'Landlord' && <RecentMatchesTenants />}
      {profileStore.role === 'Tenant' && <RecentMatchesProperties />}
      <div className='bottom'>
        <Button variant='secondary' size='large' onClick={() => navigate('/matches')}>
          View all matches
        </Button>
      </div>
    </div>
  );
})`
  & {
    width: 100%;
    padding: 64px 0px 32px 36px;
    display: grid;
    gap: 48px;
    box-sizing: border-box;

    .title {
      gap: 24px;
      display: flex;
      justify-content: center;
      align-items: flex-start;

      .typography {
        font-weight: 400;
        line-height: 48px;
      }
    }

    .bottom {
      display: flex;
      justify-content: center;
    }
  }
`;
