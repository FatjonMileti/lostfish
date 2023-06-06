import React from 'react';
import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useGlobalState } from '../../globalState';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../Home/Footer';
import { CreateProperty } from './components/CreateProperty';
import { Backdrop } from '../../components/Backdrop';
import { Grid, Paper, Box } from '@mui/material';
import axios from '../../utils/axios';
import { Tab, Tabs } from '../../components/Tab';
import { Property } from './Property';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'asset_address.country_code',
    headerName: 'Country',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.asset_address.country_code || ''}`
  },
  {
    field: 'status_string',
    headerName: 'Status',
    flex: 1
  },
  {
    field: 'Open',
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Link to={'/properties/' + params.row.id}>
        <IconButton aria-label='edit'>
          <Visibility />
        </IconButton>
      </Link>
    )
  }
];

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [1, 2, 3],
  pageSize: 1,
  page: 1,
  rowCount: 0,
  sort: 'created_At',
  asc: false,
  selectedIds: [],
  search: ''
};
export const Properties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const [list, setList] = React.useState<IGridState>({
    ...state
  });
  const [isOnCreate, setIsOnCreate] = React.useState(false);

  const navigate = useNavigate();

  const {
    user: [{ auth }]
  } = useGlobalState();

  React.useEffect(() => {
    getAssets();
  }, [tabIndex]);

  const getAssets = async () => {
    const { data } = await axios(auth.access_token).get(`/api/asset`, {
      params: {
        status: ['published', 'draft'][tabIndex]
        // page: 0,
        // pageSize: 1
      }
    });
    setList((prevList: any) => ({
      ...prevList,
      // @ts-ignore
      rows: data.docs.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  const viewDetails = (id: string) => {
    navigate(`/properties/${id}`);
  };

  return (
    <div className={`properties-page ${className}`}>
      <Header />
      <Backdrop open={list.loading}></Backdrop>

      <div className='container'>
        {!list.loading && list.rows.length === 0 && (
          <div className='no-properties'>
            <Typography variant='body2'>You currently have no properties in your portfolio</Typography>
            <Button
              size='large'
              className='add-property-button'
              startIcon={<Icon icon='plus' size={16} />}
              onClick={() => navigate('/properties/new-property')}>
              Add Property
            </Button>
          </div>
        )}

        {!list.loading && list.rows.length > 0 && (
          <>
            <div className='manage-properties-bar'>
              <Typography variant='body2'>Manage your properties</Typography>

              <Button
                variant='secondary'
                size='large'
                className='add-property-button'
                startIcon={<Icon icon='plus' size={16} />}
                onClick={() => navigate('/properties/new-property')}>
                Add Property
              </Button>
            </div>

            <Tabs value={tabIndex} onChange={setTabIndex} className='status-tabs'>
              <Tab label='Published' />
              <Tab label='Drafts' />
            </Tabs>

            <div className='properties-list'>
              {list.rows.map((p, pIndex) => (
                <Property
                  key={pIndex}
                  name={p.name}
                  status={p.status_string}
                  viewDetails={() => viewDetails(p.id)}
                  image={
                    p.property_images[0]
                      ? `${process.env.REACT_APP_BACK_END_URL}/url-to-file/${p.property_images[0]?.filename}`
                      : undefined
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* <Grid> */}
        {/*   <Button */}
        {/*     style={{ marginBottom: '2rem' }} */}
        {/*     size='small' */}
        {/*     className='add-property-button' */}
        {/*     startIcon={!isOnCreate ? <Icon icon='plus' size={16} /> : <Icon icon='close' size={16} />} */}
        {/*     onClick={() => setIsOnCreate(!isOnCreate)}> */}
        {/*     {!isOnCreate ? 'Add Property' : ''} */}
        {/*   </Button> */}
        {/*   {isOnCreate && <CreateProperty closeCreateScreen={() => setIsOnCreate(!isOnCreate)} />} */}
        {/*    */}
        {/*   {list.rows.length > 0 && !isOnCreate ? ( */}
        {/*   */}
        {/*   ) : ( */}
        {/*     */}
        {/*   )} */}
        {/* </Grid> */}
      </div>

      <CreateProperty closeCreateScreen={() => setIsOnCreate(!isOnCreate)} />

      <Footer />
    </div>
  );
})`
  &.properties-page {
    background: linear-gradient(141.18deg, #cdf0ea 10.08%, #f9f9f9 98.58%);
    min-height: 100vh;

    display: grid;
    grid-template-rows: min-content auto min-content;

    .container {
      padding: 24px 36px 48px 36px;

      .manage-properties-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-tabs {
        margin-top: 52px;
      }

      .properties-list {
        margin-top: 32px;
        display: flex;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;

        justify-content: center;
      }
    }

    .no-properties {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;

      .add-property-button {
        margin-top: 32px;
      }
    }
  }
`;
