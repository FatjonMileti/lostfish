import React, { useState } from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Modal } from '../../../components/Modal';
import { LogsTable } from '../components/LogsTable';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography } from '../../../components/Typography';
import { useUserStore } from '../../../globalState/user';
import { useApi } from '../hooks/useApi';

export const SystemMatches = () => {
  const { list, setList } = useApi({ url: `match` });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { auth } = useUserStore();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Match ID', width: 100, sortable: false, flex: 1 },
    {
      field: 'landlord',
      headerName: 'Landlord',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.landlord) {
          return `${params.row?.landlord?.first_name} ${params.row?.landlord?.last_name}`;
        }
        return '';
      },
      sortable: false
    },
    {
      field: 'tenant',
      headerName: 'Tenant',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.tenant) {
          return `${params.row?.tenant?.first_name} ${params.row?.tenant?.last_name}`;
        }
        return '';
      },
      sortable: false
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: any) => {
        return (
          <IconButton
            aria-label='view'
            onClick={() => {
              setSelectedId(params.row._id);
              setOpenModal(true);
            }}>
            <VisibilityIcon />
          </IconButton>
        );
      }
    }
  ];

  return (
    <div>
      <LogsTable list={list} setList={setList} columns={columns} />
      {user && (
        <Modal open={openModal} onBackdropClick={() => setOpenModal(!openModal)}>
          <Typography variant='body2'>Details</Typography>
        </Modal>
      )}
    </div>
  );
};
