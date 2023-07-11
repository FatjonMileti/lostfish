import React from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { Header } from '../../HomeLoggedIn/Header';
import { AssetTabs } from './PropertyDetails/components/Tabs';
import { Overview } from './PropertyDetails/components/Overview';
import { PropertyProvider } from './PropertyContext';
import { General } from './PropertyDetails/components/General';
import { PropertyApplications } from './PropertyApplications';
import { ClientPage } from './PropertyDetails/components/ClientPage';
import Can from '../../../components/Can';
import { CASLAction } from '../../../utils/ability.util';
const tabList = [
  'Overview',
  'General',
  'Details',
  'Rent',
  'Client',
  'Applicants',
  'Viewing',
  'Legals',
  'External',
  'Activity',
  'Documents',
  'Advanced',
  'Permission',
  'Payments'
];

export const PrivateProperty = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const tabPanels = [
    { content: <Overview /> },
    {
      content: <General />
    },
    {
      content: 'Details'
    },
    {
      content: 'Rent'
    },
    {
      content: 'Client'
    },
    {
      content: <PropertyApplications />
    },
    {
      content: 'Viewing'
    },
    {
      content: 'Legals'
    }
  ];

  return (
    <PropertyProvider>
      <div className={`properties-page`}>
        <Header />

        <div className='container'>
          <Paper>
            <Box sx={{ width: '90%', marginLeft: '10rem', padding: '12px', marginTop: '2rem' }}>
              <Can do={CASLAction.Manage} on='Client'>
                <ClientPage />
              </Can>
              <Can do={CASLAction.Manage} on='Agent'>
                <AssetTabs tabs={tabList} tabPanels={tabPanels} setCurrentTab={setCurrentTab} />
              </Can>
            </Box>
          </Paper>
        </div>
      </div>
    </PropertyProvider>
  );
};
