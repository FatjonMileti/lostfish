import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import React from 'react';
import axios from 'axios';
import config from '../../../config';
interface INearestPaces {
  location: {
    lat: number;
    lng: number;
  };
}

export const NearestImportantPlaces = (props: INearestPaces) => {
  const { location } = props;

  const [locations, setLocations] = React.useState<any[]>([]);

  React.useEffect(() => {
    getNearestSchools();
  }, []);

  const getNearestSchools = async () => {
    try {
      const { data } = await axios.get(
        `${config.apiUrl}/api/map/places?latitude=${location.lat}&longitude=${location.lng}`
      );

      if (data.status === 'OK') setLocations(data.results);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Box>
      <List dense={false}>
        {locations.slice(0, 3).map((location: any) => {
          return (
            <ListItem key={location.name}>
              <ListItemText primary={location.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
