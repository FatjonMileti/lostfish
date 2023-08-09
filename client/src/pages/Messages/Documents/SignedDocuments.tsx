import { Typography } from '../../../components/Typography';
import React from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import config from '../../../config';
import { Checkbox, Grid, Paper } from '@mui/material';
import { Button } from '../../../components/Button';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 9,
  page: 1,
  rowCount: 0,
  sort: 'created_at',
  asc: false,
  selectedIds: [],
  search: ''
};

export const SignedDocuments = () => {
  const { auth } = useUserStore();
  const [list, setList] = React.useState<IGridState>({
    ...state
  });

  React.useEffect(() => {
    getEnvelopes();
  }, []);

  const getEnvelopes = async () => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope`, {
      params: {
        document_type: 'Rent Contract'
      }
    });
    setList((prevList: any) => ({
      ...prevList,
      rows: data.docs,
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  const handleSign = async (item: any) => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope/${item._id}`);
    window.location.href = data.sign_url_tenant;
  };

  return (
    <div className='modal-body'>
      <Typography variant='body3'>Sign documents</Typography>
      <div></div>

      {list.rows.length > 0 ? (
        list.rows.map((item: any, index) => {
          return (
            <Paper elevation={3} style={{ padding: 10, border: '1px solid #ccc' }}>
              <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item>
                  <Checkbox defaultChecked={!!item.signed_by_tenant} disabled />
                  {item.document_type}
                </Grid>
                <Grid item style={{ display: 'flex' }}>
                  <Button onClick={() => {}} style={{ marginRight: '5px' }}>
                    View
                  </Button>
                  {!item.signed_by_tenant && <Button onClick={() => handleSign(item)}>Sign</Button>}
                </Grid>
              </Grid>
            </Paper>
          );
        })
      ) : (
        <Paper elevation={3} style={{ padding: 10, border: '1px solid #ccc' }}>
          <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>No signed documents</Typography>
          </Grid>
        </Paper>
      )}
    </div>
  );
};
