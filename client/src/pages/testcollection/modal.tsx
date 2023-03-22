import React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { Close } from '@mui/icons-material';

import { useUI } from '../../context/ui';
import { useUser } from '../../context/user';
import config from '../../config';
import { showMessage } from '../../actions/ui';

export default (props: { isOpen: boolean; item?: any | null; close: (reloadList: boolean) => void }) => {
  const userContext = useUser();
  const UIContext = useUI();
  if (!userContext || !UIContext) return null;

  const [state, setState] = useState<{
    id: string | null;
    isCompany: boolean;
    uniqueId: string;
    firstName: string;
    lastName: string;
    companyName: string;
  }>({
    id: null,
    isCompany: false,
    uniqueId: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });

  useEffect(() => {
    if (props.isOpen && props.item) {
      setState(props.item);
      setErrors((prev) => ({
        ...prev,
        server: '',
        uniqueId: false,
        uniqueIdMessage: ''
      }));
    }
  }, [props.isOpen]);

  const [errors, setErrors] = useState<{
    server: string;
    uniqueId: boolean;
    uniqueIdMessage: string;
  }>({
    server: '',
    uniqueId: false,
    uniqueIdMessage: ''
  });

  const [loading, setLoading] = useState(false);

  const save = async () => {
    setErrors((prev) => ({
      ...prev,
      uniqueId: false,
      uniqueIdMessage: '',
      server: ''
    }));

    //validation
    let isValid = true;
    if (!state.uniqueId) {
      setErrors((prev) => ({ ...prev, uniqueId: true, uniqueIdMessage: '' }));
      isValid = false;
    }
    if (state.uniqueId.length < 3) {
      setErrors((prev) => ({
        ...prev,
        uniqueId: true,
        uniqueIdMessage: 'CNP/CUI invalid'
      }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const req: any = {
      uniqueId: state.uniqueId,
      isCompany: state.isCompany
    };
    if (state.isCompany) {
      req.companyName = state.companyName || undefined;
    } else {
      req.firstName = state.firstName || undefined;
      req.lastName = state.lastName || undefined;
    }

    try {
      setLoading(true);

      if (!state.id) {
        //is new
        const response = await fetch(`${config.apiUrl}/api/testCollection`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userContext.state.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req)
        });

        const json: IAPIResponse = await response.json();
        if (!response.ok || response.status === 400) {
          if (json.message) throw new Error(json.message);
        }
        if (!response.ok || response.status !== 200) {
          throw new Error('An error occured');
        }

        props.close(true);
        showMessage(UIContext)('Successfully added!', 'success');
        return json;
      } else {
        //is edit
        const response = await fetch(`${config.apiUrl}/api/testCollection/${state.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userContext.state.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req)
        });

        const json: IAPIResponse = await response.json();
        if (!response.ok || response.status === 400) {
          if (json.message) throw new Error(json.message);
        }
        if (!response.ok || response.status !== 200) {
          throw new Error('An error occured');
        }

        props.close(true);
        showMessage(UIContext)('Successfully changed!', 'success');
        return json;
      }
    } catch (err: any) {
      console.error(err);
      setErrors((prev) => ({ ...prev, server: err?.message }));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;
        props.close(false);
      }}>
      <Box
        sx={{
          width: { xs: '370px', sm: '460px' },
          bgcolor: '#ffffff',
          boxShadow: '24px',
          padding: '32px',
          borderRadius: 4,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Typography component='h2' variant='h6' sx={{ color: '#222326' }}>
            {state.id ? 'Modifica prospect' : 'Prospect nou'}
          </Typography>
          <IconButton onClick={() => props.close(false)}>
            <Close sx={{ alignSelf: 'center', color: '#AAACB3' }} />
          </IconButton>
        </Box>
        <Box>{errors.server ? <Alert severity='error'>{errors.server}</Alert> : null}</Box>
        <Box sx={{ minWidth: 120, mt: '16px', rowGap: '16px' }} display='flex' flexDirection='column'>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.isCompany}
                onChange={() => setState((prev) => ({ ...prev, isCompany: !state.isCompany }))}
              />
            }
            label='Companie'
          />
          <TextField
            onChange={(e) => setState((prev) => ({ ...prev, uniqueId: e.target.value }))}
            variant='standard'
            value={state.uniqueId}
            required
            fullWidth
            label={state.isCompany ? 'CUI' : 'CNP'}
            name='uniqueId'
            error={errors.uniqueId}
            helperText={errors.uniqueIdMessage}
            onChangeCapture={() =>
              setErrors((prev) => ({
                ...prev,
                uniqueId: false,
                uniqueIdMessage: ''
              }))
            }
          />
          {state.isCompany ? (
            <TextField
              onChange={(e) => setState((prev) => ({ ...prev, companyName: e.target.value }))}
              variant='standard'
              value={state.companyName}
              required
              fullWidth
              label='Denumire'
              name='companyName'
            />
          ) : (
            <>
              <TextField
                onChange={(e) => setState((prev) => ({ ...prev, firstName: e.target.value }))}
                variant='standard'
                required
                value={state.firstName}
                fullWidth
                label='Prenume'
                name='firstName'
              />
              <TextField
                onChange={(e) => setState((prev) => ({ ...prev, lastName: e.target.value }))}
                variant='standard'
                value={state.lastName}
                required
                fullWidth
                label='Nume'
                name='lastName'
              />
            </>
          )}
          <LoadingButton
            onClick={save}
            disabled={loading}
            loading={loading}
            variant='contained'
            sx={{ alignSelf: 'flex-end', mt: '8px', minWidth: '80px' }}>
            {state.id ? 'Modifica' : 'Adauga'}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};
