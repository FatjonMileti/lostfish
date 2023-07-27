import React from 'react';
import { styled } from '@mui/system';
import { Box, Paper, Grid } from '@mui/material';
import { Sessions } from './pages/Sessions';
import { useLocation } from 'react-router-dom';
import { PropertyLogs } from './pages/PropertyLogs';
import { DashboardNavbar } from './components/DashboardNavbar';
import { MatchesLogs } from './pages/MatchesLogs';
import { Header } from '../HomeLoggedIn/Header';

const ItemContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  height: '100%',
  color: theme.palette.text.secondary
}));

export const AgentDashboard = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const location = useLocation();

  const getRequestedComponent = () => {
    if (location.pathname === '/dashboard') {
      return <Sessions />;
    }
    if (location.pathname === '/property-log') {
      return <PropertyLogs />;
    }

    if (location.pathname === '/matches-log') {
      return <MatchesLogs />;
    }

    return <div></div>;
  };

  return (
    <div className={`home-page ${className}`}>
      <Header />

      <div className='container'>
        <Box sx={{ flexGrow: 1, margin: '10px 25px 10px 25px' }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <DashboardNavbar />
            </Grid>
            <Grid item xs={10}>
              <ItemContent>
                <Box>{getRequestedComponent()}</Box>
              </ItemContent>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    background-color: #f7f1e7;

    grid-template-rows: min-content auto;

    .header {
      z-index: 1;
    }
  }
`;
