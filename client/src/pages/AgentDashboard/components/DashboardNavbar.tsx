import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleIcon from '@mui/icons-material/People';
import { styled } from '@mui/system';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  height: '100%',
  color: theme.palette.text.secondary
}));

export const DashboardNavbar = () => {
  const location = useLocation();

  return (
    <Item>
      <List>
        <ListItem
          component={Link}
          to='/dashboard'
          style={{ backgroundColor: location.pathname === '/dashboard' ? '#B2ADAC' : '' }}>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary='Active sessions' />
        </ListItem>
        <ListItem
          component={Link}
          to='/property-log'
          style={{ backgroundColor: location.pathname === '/property-log' ? '#B2ADAC' : '' }}>
          <ListItemIcon>
            <HomeWorkIcon />
          </ListItemIcon>
          <ListItemText primary='Property logs' />
        </ListItem>
        <ListItem
          component={Link}
          to='/matches-log'
          style={{ backgroundColor: location.pathname === '/matches-log' ? '#B2ADAC' : '' }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary='Matches logs' />
        </ListItem>
      </List>
    </Item>
  );
};
