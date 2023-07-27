import React from 'react';
import { styled } from '@mui/system';
import { DashboardHeader } from './components/DashboardHeader';
import { Box, Paper, Grid } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleIcon from '@mui/icons-material/People';
import { Sessions } from './pages/Sessions';
import { Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  height: '100%',
  color: theme.palette.text.secondary
}));

const ItemContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  height: '100%',
  color: theme.palette.text.secondary
}));

export const AgentDashboard = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`home-page ${className}`}>
      <DashboardHeader />

      <div className='container'>
        <Box sx={{ flexGrow: 1, margin: '10px 25px 10px 25px' }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Item>
                <List>
                  <ListItem component={Link} to='/dashboard' className='active'>
                    <ListItemIcon>
                      <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary='Active sessions' />
                  </ListItem>
                  <ListItem component={Link} to='/dashboard/property'>
                    <ListItemIcon>
                      <HomeWorkIcon />
                    </ListItemIcon>
                    <ListItemText primary='Property interactions' />
                  </ListItem>
                  <ListItem component={Link} to='/dashboard/matches'>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary='Matches interactions' />
                  </ListItem>
                </List>
              </Item>
            </Grid>
            <Grid item xs={10}>
              <ItemContent>
                <Box>
                  <Sessions />
                </Box>
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
