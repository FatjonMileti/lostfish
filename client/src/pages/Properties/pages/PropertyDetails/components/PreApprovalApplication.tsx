import React from 'react';
import { Typography } from '../../../../../components/Typography';
import { Grid } from '@mui/material';
import { useGlobalState } from '../../../../../globalState';
import axios from '../../../../../utils/axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField } from '../../../../../components/TextField';
import { FormControlledSelect } from '../../../components/FormControlledSelect';
import { Button } from '../../../../../components/Button';
import { UploadImages } from '../../../components/UploadImages';
import config from '../../../../../config';

enum ApproveType {
  PRE_APPROVE = 'Pre approval',
  APPROVE = 'Approval'
}

const DOCUMENT_TYPES: any[] = [
  {
    type: 'Employer reference',
    value: ''
  },
  {
    type: 'Landlord reference',
    value: ''
  },
  {
    type: 'Proof of ID',
    value: ''
  }
];

export const PreApprovalApplication = () => {
  const [property, setProperty] = React.useState<any>(null);
  const [documents, setDocuments] = React.useState<any[]>(DOCUMENT_TYPES);
  const [application, setApplication] = React.useState<any | null>(null);
  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset
  } = useForm();

  React.useEffect(() => {
    getApplicationStatus();
  }, []);

  const getApplicationStatus = async () => {
    const response = await axios(auth.access_token).get('/api/asset/' + params.id + '/application');
    setApplication(response.data);
  };

  const params = useParams<{ id: string }>();

  const onSubmit = async (data: any) => {
    try {
      data.approve_type = ApproveType.PRE_APPROVE;
      const response = await axios(auth.access_token).post(`/api/asset/${params.id}/send-application`, data);
      alert('Success');
      setApplication(response.data);
      reset();
    } catch (errors) {
      // Reset the form errors
      clearErrors();
    }
  };

  const handleImagesUpload = (images: any[], docType?: any) => {
    if (docType) {
      setDocuments((prevItems: any[]) =>
        prevItems.map((item: any) => {
          if (item.type === docType.type) {
            return { ...item, value: `${config.apiUrl}/url-to-user-docs/${images[0].filename}` };
          }
          return item;
        })
      );
    }
  };

  const saveDocuments = async () => {
    try {
      const response = await axios(auth.access_token).patch(`/api/asset/${params.id}/update-application`, {
        documents
      });
      alert('Success');
      setApplication(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const afterPreApprove: JSX.Element = (
    <Grid container spacing={3} mt={3} mb={5}>
      <Typography variant='body3'>
        We have pre-approved your application. We just need a few more details to fully approve you.
      </Typography>
      {DOCUMENT_TYPES?.map((document: any) => {
        return (
          <Grid item md={4} sm={6} lg={3} key={document.type}>
            <Typography variant='body5'>{document.type}</Typography>
            <UploadImages
              handleImagesUpload={handleImagesUpload}
              url='/upload-docs'
              multiple={false}
              type={document}
            />
          </Grid>
        );
      })}
      {documents.filter((doc: any) => !!doc.value).length === 3 && (
        <Grid item md={4} sm={6} lg={3}>
          <Button onClick={() => saveDocuments()}>Save documents</Button>
        </Grid>
      )}
    </Grid>
  );

  const renderApplicationLifeCycle = () => {
    if (!application) {
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography>Pre approval application</Typography>
          <Grid container spacing={3} mt={3} mb={5}>
            <Grid item xs={6} md={6}>
              <TextField
                label='How many adults will be moving in?'
                variant='outlined'
                {...register('adults_number')}
                error={!!errors?.adults_number}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <FormControlledSelect
                control={control}
                values={[
                  ['Yes', 'Yes'],
                  ['No', 'No']
                ]}
                name='will_have_pets'
                label='Will there be any pets'
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label='When are you looking to move in?'
                type='date'
                variant='outlined'
                {...register('move_in_date')}
                error={!!errors?.move_in_date}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <FormControlledSelect
                control={control}
                values={[
                  ['Yes', 'Yes'],
                  ['No', 'No']
                ]}
                name='agreed_terms'
                label='Agree to terms and conditions'
              />
            </Grid>
            <Grid item xs={6} md={6} mt={3}>
              <Button type='submit'>Submit</Button>
            </Grid>
          </Grid>
        </form>
      );
    }

    const areImagesApproved: boolean = application.documents.every((doc: any) => doc.approved);

    if (application && !application.pre_approve_status) {
      return <Typography variant='body3'>Waiting for approval</Typography>;
    }

    if (
      application &&
      application.pre_approve_status &&
      application.approve_type === 'Approval' &&
      application.documents.length === 0
    ) {
      return afterPreApprove;
    }

    if (application && !application.approve_status) {
      return <Typography variant='body3'>Waiting for approval of your documents</Typography>;
    }

    if (application.application_status === 'Completed') {
      return <Typography variant='body3'>Rented</Typography>;
    }

    if (application && application.approve_status && areImagesApproved) {
      return (
        <Grid>
          <Typography variant='body3'>Your application to rent this property has been approved.</Typography>;
          <Typography variant='body4'>
            Please pay the rental deposit - Amount £ {application?.asset?.asset_rent?.deposit_amount}
          </Typography>
          <br />
          <input type='radio' checked /> Manual payment
          <br />
          <br />
          <Button onClick={() => handlePaymant()}>Confirm</Button>
        </Grid>
      );
    }

    return null;
  };

  const handlePaymant = async () => {
    try {
      const { data } = await axios(auth.access_token).patch(`/api/asset/${params.id}/update-application`, {
        payment: application?.asset?.asset_rent?.deposit_amount
      });
      alert('Success');
      setApplication(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return renderApplicationLifeCycle();
};
