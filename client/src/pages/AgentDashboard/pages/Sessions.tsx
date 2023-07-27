import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import config from '../../../config';
import { Search } from '../components/Search';
import moment from 'moment';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [50, 100, 200],
  pageSize: 50,
  page: 0,
  rowCount: 0,
  sort: 'date',
  asc: false,
  selectedIds: [],
  search: '',
  filters: {
    type: 'all'
  }
};

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

export const Sessions = () => {
  const { auth } = useUserStore();

  const [list, setList] = React.useState<IGridState>({
    ...state
  });

  React.useEffect(() => {
    getSessions();
  }, [list.sort, list.asc, list.page, list.pageSize, list.filters]);

  const getSessions = async () => {
    const { page, pageSize, asc, search, sort } = list;
    const params: any = {
      page: page + 1,
      pageSize: pageSize,
      sort: sort || undefined,
      asc: asc.toString() || undefined,
      status: search || undefined
    };

    if (list.filters?.type) {
      params.type = list.filters.type;
    }

    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/admin/session`, {
      params
    });
    setList((prevList: any) => ({
      ...prevList,
      rows: data.docs,
      totalRows: data.totalDocs,
      rowCount: data.totalDocs,
      loading: false
    }));
  };

  const onSortModelChange = (d: any) => {
    const selectedSort = d[0] || undefined;
    if (selectedSort) {
      setList((prevList: any) => ({
        ...prevList,
        sort: selectedSort.field,
        asc: selectedSort.sort === 'asc'
      }));
    }
  };
  const onPageChange = (d: number) => {
    setList((prevList: any) => ({
      ...prevList,
      page: d
    }));
  };

  const onPageSizeChange = (d: number) => {
    setList((prevList: any) => ({
      ...prevList,
      pageSize: d
    }));
  };

  return (
    <div style={{ height: '600px' }}>
      <Search
        search={(value) => {
          setList((prev) => ({ ...prev, search: value }));
        }}
        filter={(filters) => {
          setList((prev) => ({ ...prev, filters }));
        }}
      />
      <DataGrid
        sortingMode='server'
        sortingOrder={['asc', 'desc']}
        page={list.page}
        pageSize={list.pageSize}
        rowCount={list.totalRows}
        paginationMode='server'
        onSortModelChange={(d: any) => onSortModelChange(d)}
        onPageChange={(d: number) => onPageChange(d)}
        onPageSizeChange={(d: number) => onPageSizeChange(d)}
        rowHeight={30}
        rows={list.rows}
        columns={columns}
        density='comfortable'
      />
    </div>
  );
};
