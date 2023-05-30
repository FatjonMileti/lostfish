import React from 'react';
import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useGlobalState } from '../../globalState';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { useReactQueryHook } from '../../hooks/useReactQuery';
import IconButton from '@mui/material/IconButton';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Footer } from '../Home/Footer';
import { CreateProperty } from './components/CreateProperty';
import { Backdrop } from '../../components/Backdrop';
import Grid from '@mui/material/Grid';

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

export const Properties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [isOnCreate, setIsOnCreate] = React.useState(false);

  const { list, isLoading, setList } = useReactQueryHook({ url: 'asset', name: 'properties' });

  if (isLoading) {
    return <p>Loader...</p>;
  }

  return (
    <div className={`properties-page ${className}`}>
      <Header />
      <Grid>
        <Button
          size='small'
          className='add-property-button'
          startIcon={!isOnCreate ? <Icon icon='plus' size={16} /> : <Icon icon='close' size={16} />}
          onClick={() => setIsOnCreate(!isOnCreate)}>
          {!isOnCreate ? 'Add Property' : ''}
        </Button>
        {isOnCreate && <CreateProperty closeCreateScreen={() => setIsOnCreate(!isOnCreate)} />}
        {list.rows.length > 0 && !isOnCreate ? (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={list.rows}
              columns={columns}
              pageSize={list.pageSize}
              rowsPerPageOptions={list.rowsPerPageOptions}
            />
          </div>
        ) : (
          <div className='no-properties'>
            {/*<Typography variant='body2'>You currently have no properties in your portfolio</Typography>*/}
            {/*<Button size='large' className='add-property-button' startIcon={<Icon icon='plus' size={16} />}>*/}
            {/*  Add Property*/}
            {/*</Button>*/}
          </div>
        )}
      </Grid>

      <Footer />
    </div>
  );
})`
  &.properties-page {
    background: linear-gradient(141.18deg, #cdf0ea 10.08%, #f9f9f9 98.58%);
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto min-content;

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
