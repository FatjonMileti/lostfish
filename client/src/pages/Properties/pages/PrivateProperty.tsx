import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Grid, Paper } from '@mui/material';
import { Map } from './PropertyDetails/components/Map';
import { NearestPlaces } from './PropertyDetails/components/NearestPlaces';
import { NearestSchools } from './PropertyDetails/components/NearestSchools';
import { NearestImportantPlaces } from './PropertyDetails/components/NearestImportantPlaces';
import { useGlobalState } from '../../../globalState';
import axios from '../../../utils/axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '../../../components/TextField';
import { MasterAssetTypeSring, PersonTitle } from '../property.interface';
import { FormControlledSelect } from '../components/FormControlledSelect';
import { PreApprovalApplication } from './PropertyDetails/components/PreApprovalApplication';
import { Header } from '../../HomeLoggedIn/Header';
import { Backdrop } from '../../../components/Backdrop';
import { AssetTabs } from './PropertyDetails/components/Tabs';
import { Overview } from './PropertyDetails/components/Overview';
import { PropertyProvider } from './PropertyContext';
import { General } from './PropertyDetails/components/General';
import { PropertyApplications } from './PropertyApplications';
import { ClientPage } from './PropertyDetails/components/ClientPage';
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
  const [property, setProperty] = React.useState<any>(null);
  const [conditions, setConditions] = React.useState<any[]>([]);
  const [currentTab, setCurrentTab] = React.useState(0);
  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

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
              {userDetails && userDetails.role === 'Admin' && (
                <AssetTabs tabs={tabList} tabPanels={tabPanels} setCurrentTab={setCurrentTab} />
              )}
              {userDetails && userDetails.role === 'User' && <ClientPage />}
            </Box>
          </Paper>
        </div>
      </div>
    </PropertyProvider>
  );
};
