import React from 'react';
import { Typography } from '../../../components/Typography';
import { Grid } from '@mui/material';
import { useGlobalState } from '../../../globalState';
import axios from '../../../utils/axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField } from '../../../components/TextField';
import { FormControlledSelect } from '../../Properties/components/FormControlledSelect';
import { Button } from '../../../components/Button';

enum ApproveType {
  PRE_APPROVE = 'Pre approval',
  APPROVE = 'Approval'
}

export const PreApprovalApplication = () => {
  const [property, setProperty] = React.useState<any>(null);
  const [conditions, setConditions] = React.useState<any[]>([]);
  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    getValues,
    reset
  } = useForm();

  const params = useParams<{ id: string }>();

  const onSubmit = async (data: any) => {
    try {
      data.approve_type = ApproveType.PRE_APPROVE;
      const response = await axios(auth.access_token).post(`/api/asset/${params.id}/send-application`, data);
      alert('Success');
      reset();
    } catch (errors) {
      // Reset the form errors
      clearErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} mt={3} mb={5}>
        <Grid item md={6}>
          <Typography>Pre approval application</Typography>
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
      </Grid>
    </form>
  );
};
