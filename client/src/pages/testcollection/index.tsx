import React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import { useUI } from '../../context/ui';
import { useUser } from '../../context/user';
import config from '../../config';
import { showMessage } from '../../actions/ui';

import Search from './search';
import DetailsModal from './modal';

export default () => {
  const userContext = useUser();
  const UIContext = useUI();
  if (!userContext || !UIContext) return null;

  const [list, setList] = useState<IGridState>({
    loading: true,
    rows: [],
    totalRows: 0,

    rowsPerPageOptions: [10, 20, 50],

    pageSize: 10,
    page: 1,
    rowCount: 0,
    sort: 'createdAt',
    asc: false,

    selectedIds: [],
    search: ''
  });

  const getItems = async () => {
    const { search, asc, sort, pageSize, page } = list;

    let json: IAPIResponse | null = null;
    try {
      let query: string = `?page=${page}`;
      if (pageSize) {
        query += `&pageSize=${pageSize}`;
      }
      if (sort) {
        query += `&sort=${sort}&asc=${asc.toString()}`;
      }
      if (search) {
        query += `&search=${search}`;
      }

      const response = await fetch(`${config.apiUrl}/api/testCollection${query}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${userContext.state.token}` }
      });

      if (!response.ok || response.status !== 200) {
        throw new Error('NOK');
      }

      json = await response.json();
    } catch (err) {
      console.error(err);
      showMessage(UIContext)('An error occured!', 'error');
    }

    setList((prev) => ({
      ...prev,
      loading: false,
      rows: json ? json.docs : [],
      rowCount: json ? json.totalDocs : 0
    }));
  };

  useEffect(() => {
    setList((prev) => ({ ...prev, loading: true }));
    getItems();
  }, [list.page, list.pageSize, list.sort, list.asc, list.search]);

  const [modal, setModal] = useState<{ open: boolean; item: null | object }>({
    open: false,
    item: null
  });

  const [deleting, setDeleting] = useState(false);
  const deleteSelectedIds = async () => {
    try {
      const deletePromises = [];
      for (const id of list.selectedIds) {
        deletePromises.push(
          fetch(`${config.apiUrl}/api/testCollection/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userContext.state.token}` }
          })
        );
      }
      await Promise.all(deletePromises);
      showMessage(UIContext)('Successfully added!', 'success');
      getItems();
    } catch (err) {
      console.error(err);
      showMessage(UIContext)('An error occured!', 'error');
    }
    return true;
  };

  return (
    <>
      <Search
        search={(value) => {
          setList((prev) => ({ ...prev, search: value }));
        }}
        openModal={() => setModal((prev) => ({ ...prev, open: true, item: null }))}
      />
      {list.selectedIds.length > 0 ? (
        <LoadingButton
          onClick={async () => {
            setDeleting(true);
            await deleteSelectedIds();
            setDeleting(false);
          }}
          color='error'
          disabled={deleting}
          loading={deleting}
          sx={{
            display: 'flex',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}>
          <Delete fontSize='small' />
        </LoadingButton>
      ) : null}
      <Box sx={{ width: '100%', paddingTop: '25px' }}>
        <DataGrid
          checkboxSelection={true}
          disableSelectionOnClick={true}
          autoHeight={true}
          pagination={true}
          loading={list.loading}
          rowCount={list.rowCount}
          rowsPerPageOptions={list.rowsPerPageOptions}
          rows={list.rows}
          onSelectionModelChange={(selectionModel: GridSelectionModel) => {
            setList((prev) => ({
              ...prev,
              selectedIds: selectionModel.map((x) => x.toString())
            }));
          }}
          columns={[
            {
              field: 'edit',
              sortable: false,
              type: 'actions',
              width: 55,
              renderCell: (params: any) => {
                return (
                  <IconButton
                    color='primary'
                    size='large'
                    sx={
                      {
                        // width: '24px',
                        // minWidth: 'auto'
                      }
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      setModal((prev) => ({
                        ...prev,
                        open: true,
                        item: params.row
                      }));
                    }}>
                    <Edit fontSize='small' />
                  </IconButton>
                );
              }
            },
            {
              field: 'uniqueId',
              headerName: 'CNP/CUI',
              type: 'string',
              width: 140
            },
            {
              field: 'isCompany',
              headerName: 'Companie',
              width: 180,
              type: 'boolean'
            },
            {
              field: 'firstName',
              headerName: 'Prenume',
              width: 180,
              type: 'string'
            },
            {
              field: 'createdAt',
              headerName: 'Creat la',
              width: 180,
              type: 'date',
              renderCell: (params: any) => {
                return moment(params.row.createdAt).format('HH:mm DD.MM.YY');
              }
            }
          ].map((column) => ({
            ...column,
            filterable: false
          }))}
          onRowDoubleClick={(params: any) => {
            setModal((prev) => ({
              ...prev,
              open: true,
              item: params.row
            }));
          }}
          showCellRightBorder
          paginationMode='server'
          page={list.page - 1}
          pageSize={list.pageSize}
          onPageChange={(d: number) => {
            setList((prev) => ({ ...prev, page: d + 1 }));
          }}
          onPageSizeChange={(d: number) => {
            setList((prev) => ({ ...prev, page: 1, pageSize: d }));
          }}
          sortingMode='server'
          sortingOrder={['asc', 'desc']}
          sortModel={[{ field: list.sort, sort: list.asc ? 'asc' : 'desc' }]}
          onSortModelChange={(d: any) => {
            if (d && d.length > 0) {
              setList((prev) => ({
                ...prev,
                sort: d[0].field,
                asc: d[0].sort === 'asc'
              }));
            }
          }}
        />
      </Box>
      {modal.open && (
        <DetailsModal
          item={modal.item}
          isOpen={modal.open}
          close={(reloadList) => {
            setModal((prev) => ({ ...prev, open: false }));
            if (reloadList) {
              getItems();
            }
          }}
        />
      )}
    </>
  );
};
