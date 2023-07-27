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

interface IDashboardNavbar {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

export const DashboardNavbar = ({ activeTab, setActiveTab }: IDashboardNavbar) => {
  const location = useLocation();

  return (
    <Item>
      <List>
        <ListItem
          style={{ backgroundColor: activeTab === 0 ? '#B2ADAC' : '', cursor: 'pointer' }}
          onClick={() => {
            setActiveTab(0);
          }}>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary='Active sessions' />
        </ListItem>
        <ListItem
          style={{ backgroundColor: activeTab === 1 ? '#B2ADAC' : '', cursor: 'pointer' }}
          onClick={() => {
            setActiveTab(1);
          }}>
          <ListItemIcon>
            <HomeWorkIcon />
          </ListItemIcon>
          <ListItemText primary='Property logs' />
        </ListItem>
        <ListItem
          style={{ backgroundColor: activeTab === 2 ? '#B2ADAC' : '', cursor: 'pointer' }}
          onClick={() => {
            setActiveTab(2);
          }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary='Matches logs' />
        </ListItem>
      </List>
    </Item>
  );
};
