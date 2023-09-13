import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IGridState } from '../../../react-app-env';

interface ITableLog {
  list: IGridState;
  setList: React.Dispatch<React.SetStateAction<IGridState>>;
  columns: GridColDef[];
}

export const LogsTable = (props: ITableLog) => {
  const { list, setList, columns } = props;
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
    <DataGrid
      autoHeight={true}
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
      disableColumnSelector
    />
  );
};
