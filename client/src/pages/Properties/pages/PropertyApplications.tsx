import React from 'react';
import { useReactQueryHook } from '../../../hooks/useReactQuery';
import { useParams } from 'react-router-dom';
import { Header } from '../../HomeLoggedIn/Header';
import { Backdrop } from '../../../components/Backdrop';
import { Grid, Paper, Box } from '@mui/material';
import { Typography } from '../../../components/Typography';
import axios from '../../../utils/axios';
import { useGlobalState } from '../../../globalState';
import { Button } from '../../../components/Button';

export const PropertyApplications = () => {
  const params = useParams<{ id: string }>();
  const { list, isLoading, isFetching, setList } = useReactQueryHook({
    url: `asset/${params.id}/get-applications`,
    name: 'applications'
  });

  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  if (isLoading) {
    return <p>Loader...</p>;
  }

  const preApprove = async (id: string) => {
    try {
      const response = await axios(auth.access_token).patch(`/api/asset/${id}/approve`, {
        pre_approve_status: true
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  const approveAll = async (id: string) => {
    try {
      const response = await axios(auth.access_token).put(`/api/asset/${id}/approve`, {
        approve_status: true
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className={`properties-page`}>
      <Header />
      <Backdrop open={isLoading || isFetching}></Backdrop>
      <div className='container'>
        <Paper>
          <Box sx={{ width: '90%', marginLeft: '10rem', padding: '12px', marginTop: '2rem' }}>
            <Typography>Applications page</Typography>

            {list.rows.map((item: any, index: number) => {
              return (
                <Grid container spacing={3} mt={5} key={index}>
                  <Grid item md={3} sm={6} lg={3}>
                    Details
                    <br /> Legal name: {`${item.applicant.first_name} ${item.applicant.last_name}`}
                  </Grid>
                  <Grid item md={3} sm={6} lg={3}>
                    Documents
                    <br />
                    No documents
                  </Grid>
                  <Grid item md={3} sm={6} lg={3}>
                    Questions <br />
                    <Typography variant='body4'>
                      Will there be any pets ? <b>{item.adults_number}</b>
                    </Typography>
                    <br />
                    <Typography variant='body4'>
                      How many adults will be moving in ? <b>{item.have_pets ? 'Yes' : 'No'}</b>
                    </Typography>
                    <br />
                    <Typography variant='body4'>
                      When are you looking to move in ? <b>{item.move_in_date}</b>
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} lg={3}>
                    {item.approve_type === 'Pre approval' && !item.pre_approve_status && (
                      <Button onClick={() => preApprove(item.id)}>Pre approve</Button>
                    )}
                    {item.approve_type === 'Approval' && (
                      <Button onClick={() => approveAll(item.id)}>Approve</Button>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </Paper>
      </div>
    </div>
  );
};
