import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../HomeLoggedIn/Header';
import { Backdrop } from '../../../components/Backdrop';
import { Grid, Paper, Box } from '@mui/material';
import { Typography } from '../../../components/Typography';
import axios from '../../../utils/axios';
import { useGlobalState } from '../../../globalState';
import { Button } from '../../../components/Button';
import moment from 'moment';

import { MuiModal } from '../../../components/MuiModal';
import request from '../../../utils/axios';

export const PropertyApplications = () => {
  const params = useParams<{ id: string }>();
  const [applications, setApplications] = React.useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = React.useState<any>(null);
  const [selectedDocument, setSelectedDocument] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    const { data } = await request(auth.access_token).get(`/api/asset/${params.id}/get-applications`);
    setApplications(data.docs);
    setLoading(false);
  };

  const {
    user: [{ auth }]
  } = useGlobalState();

  if (loading) {
    return <p>Loader...</p>;
  }

  const preApprove = async (id: string) => {
    try {
      await axios(auth.access_token).patch(`/api/asset/${id}/approve-application`, {
        pre_approve_status: true
      });
      getApplications();
    } catch (err: any) {
      console.log(err);
    }
  };

  const approveAll = async (item: any) => {
    try {
      await axios(auth.access_token).patch(`/api/asset/${item._id}/approve-application`, {
        approve_status: true,
        documents: item.documents
      });
      getApplications();
    } catch (err: any) {
      console.log(err);
    }
  };

  const approveDocument = (isApproved: boolean) => {
    setApplications((prevItems: any[]) =>
      prevItems.map((item: any) => {
        if (item._id === selectedApplication._id) {
          return {
            ...item,
            documents: item.documents.map((doc: any) => {
              if (doc.type === selectedDocument.type) {
                return { ...doc, approved: isApproved };
              } else {
                return doc;
              }
            })
          };
        }
        return item;
      })
    );
    setTimeout(() => {
      setSelectedDocument(null);
      setSelectedDocument(null);
    }, 200);
  };

  return (
    <div>
      {applications?.map((item: any, index: number) => {
        const areImagesApproved: boolean = item.documents.every((doc: any) => doc.approved);

        return (
          <Grid container spacing={3} mt={5} key={index}>
            <Grid item md={3} sm={6} lg={3}>
              Details
              <br /> Legal name: {`${item.applicant.first_name} ${item.applicant.last_name}`}
            </Grid>
            <Grid item md={3} sm={6} lg={3}>
              Documents
              <br />
              {item.documents?.map((doc: any, docIndex: number) => {
                return (
                  <div>
                    {doc.type} -
                    {doc.value ? (
                      <Button
                        size='small'
                        onClick={() => {
                          setSelectedDocument(doc);
                          setSelectedApplication(item);
                        }}>
                        Preview
                      </Button>
                    ) : (
                      'No'
                    )}
                  </div>
                );
              })}
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
                When are you looking to move in ? <b>{moment(item.move_in_date).format('DD-MM-YYYY')}</b>
              </Typography>
            </Grid>
            <Grid item md={3} sm={6} lg={3}>
              {item.approve_type === 'Pre approval' && !item.pre_approve_status && (
                <Button onClick={() => preApprove(item._id)}>Pre approve</Button>
              )}
              {item.approve_type === 'Approval' && !item.approve_status && (
                <Button onClick={() => approveAll(item)} disabled={!areImagesApproved}>
                  Approve
                </Button>
              )}
              {item.approve_type === 'Approval' && item.approve_status && <Button>Cancel</Button>}
            </Grid>
          </Grid>
        );
      })}
      <MuiModal open={!!selectedDocument} close={() => setSelectedDocument(null)}>
        <Grid container spacing={5}>
          <Grid item md={7}>
            <img src={selectedDocument?.value} width='100%' />
          </Grid>
          <Grid item md={5}>
            <Typography>Approve Document</Typography>

            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => approveDocument(true)} disabled={!!selectedDocument?.approved}>
                {selectedDocument?.approved ? 'Approved' : 'Approve'}
              </Button>
              <Button onClick={() => approveDocument(false)}>Reject</Button>
            </div>
          </Grid>
        </Grid>
      </MuiModal>
    </div>
  );
};
