import React, { useState } from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Modal } from '../../../components/Modal';
import { Search } from '../components/Search';
import moment from 'moment';
import { LogsTable } from '../components/LogsTable';
import { LoginLogAction } from '../agent.interface';
import { useLogs } from '../hooks/useLogs';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, sortable: false },
  {
    field: 'user.first_name',
    headerName: 'Firstname',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.user && params.row.user !== 'null') {
        return `${params.row.user?.first_name || ''}`;
      }
      return '';
    },
    sortable: false
  },
  {
    field: 'user.last_name',
    headerName: 'Lastname',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.user && params.row.user !== 'null') {
        return `${params.row.user?.last_name || ''}`;
      }
      return '';
    },
    sortable: false
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: false
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    valueGetter: (params: any) => moment(params.row.date).format('DD-MM-YYYY'),
    sortable: false
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params: any) => {
      return (
        <IconButton aria-label='view'>
          <VisibilityIcon />
        </IconButton>
      );
    }
  }
];

export const Sessions = () => {
  const { list, setList } = useLogs({ url: 'session' });
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <div style={{ height: '600px' }}>
      <Search
        search={(value) => {
          setList((prev) => ({ ...prev, search: value }));
        }}
        filter={(filters) => {
          setList((prev) => ({ ...prev, filters }));
        }}
        actionValues={Object.values(LoginLogAction)}
      />
      <LogsTable list={list} setList={setList} columns={columns} />
      <Modal open={openModal} closeModal={() => setOpenModal(!openModal)} />
    </div>
  );
};
