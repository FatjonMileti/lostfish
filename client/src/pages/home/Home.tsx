import React from 'react';
import Logo from '../../assets/svg/Exclude.svg';
import HeaderImage from '../../assets/images/header-image.png';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button } from '../../common/Button';

const links = ['Rent', 'Buy', 'Sell'];
export const Home = () => {
  return (
    <>
      <Grid container spacing={2} className='header'>
        <Grid item md={10}>
          <div className='menu'>
            {links.map((link: string) => {
              return <div className='header-link'>{link}</div>;
            })}
          </div>
        </Grid>
        <Grid item md={2}>
          <div className='menu-button'>
            <Button label='Join our community' />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <div className='logo-handler'>
          <img src={Logo} />
        </div>
      </Grid>
      <Grid container spacing={2}>
        <div className='banner'>
          <h1>Welcome to Lostfish.</h1>
          <h4>Where fome finds you.</h4>
        </div>
      </Grid>
      <Grid container spacing={2}>
        <div className='image-handler'>
          <img src={HeaderImage} />
        </div>
      </Grid>
      <Grid container spacing={2}>
        <div className='about-us'>
          <Typography variant='h1'>OUR MISSION</Typography>
          <Typography>
            LostFish, aims to revolutionise the property industry by utilising technology and data to empower
            and inform customers in the buying, selling, and renting process.
          </Typography>
          <div style={{ marginTop: '2rem' }}>
            <Button label='Join our community' />
          </div>
        </div>
      </Grid>
      <Grid container spacing={2}>
        <div className='about-you'>
          <Typography variant='h1'>WHAT'S IN IT FOR YOU</Typography>
        </div>
      </Grid>
    </>
  );
};
