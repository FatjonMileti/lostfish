import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import Grid from '@mui/material/Grid';
import { Map } from './components/Map';
import { NearestPlaces } from './components/NearestPlaces';
import { NearestSchools } from './components/NearestSchools';
import { NearestImportantPlaces } from './components/NearestImportantPlaces';

const center = {
  lat: 41.315113718633036,
  lng: 19.80667044347207
};

export const Maps = () => {
  const [dense, setDense] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8} md={8}>
          <Typography variant='h3'>Maps</Typography>
          <Typography variant='body2'>
            Morbi posuere, nibh vel mollis finibus, sem felis varius est, ac sodales ipsum ipsum sed dolor.
            Proin odio metus, rhoncus non congue eget, tempus id metus. Sed porttitor dictum sapien, vitae
            vehicula erat aliquam sit amet. Etiam lobortis dolor eget arcu condimentum convallis. Morbi porta
            placerat interdum. Phasellus convallis sapien vel egestas sodales. Aenean at pellentesque metus.
            Quisque auctor consectetur odio. Donec id libero viverra leo rutrum posuere. Vestibulum dictum
            vehicula tempor. Sed at aliquam eros. Aenean laoreet tincidunt placerat.
          </Typography>
        </Grid>
        <Grid item xs={4} md={4}></Grid>
        <Grid item xs={8} md={8}>
          <Map />
          <Box sx={{ display: 'flex' }} mt='2rem'>
            <Button>Nearest stations</Button>
            <Button>Nearest schools</Button>
            <Button>Important places</Button>
          </Box>
          <Box>
            <Grid container>
              <Grid item md={4}>
                <NearestPlaces location={center} />
              </Grid>
              <Grid item md={4}>
                <NearestSchools location={center} />
              </Grid>
              <Grid item md={4}>
                <NearestImportantPlaces location={center} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4} md={4}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </Box>
  );
};
