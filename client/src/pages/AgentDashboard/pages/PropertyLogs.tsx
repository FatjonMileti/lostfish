import React from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Search } from '../components/Search';
import moment from 'moment';
import { LogsTable } from '../components/LogsTable';
import { LogAction } from '../agent.interface';
import { useLogs } from '../hooks/useLogs';

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
    field: 'active',
    headerName: 'Active',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => (params.row.active ? 'Yes' : 'No'),
    sortable: false
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    valueGetter: (params: any) => moment(params.row.date).format('DD-MM-YYYY'),
    sortable: false
  }
];

export const PropertyLogs = () => {
  const { list, setList } = useLogs({ url: 'property' });

  return (
    <div style={{ height: '600px' }}>
      <Search
        search={(value) => {
          setList((prev) => ({ ...prev, search: value }));
        }}
        filter={(filters) => {
          setList((prev) => ({ ...prev, filters }));
        }}
        actionValues={Object.values(LogAction)}
      />
      <LogsTable list={list} setList={setList} columns={columns} />
    </div>
  );
};
