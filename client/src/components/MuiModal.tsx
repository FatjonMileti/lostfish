import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useState } from 'react';

interface IModalProps {
  open: boolean;
  close: any;
  children: any;
  width?: string;
}

export const MuiModal = (props: IModalProps) => {
  const { open, close, children } = props;
  const [width, setWidth] = useState<string>('60%');

  React.useEffect(() => {
    if (props?.width) {
      setWidth(props.width);
    }
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason && reason === 'backdropClick') return;
          close();
        }}>
        <Box
          sx={{
            width,
            bgcolor: '#ffffff',
            boxShadow: '24px',
            padding: '32px',
            borderRadius: 4,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
          <Grid style={{ display: 'flex' }}>
            <IconButton onClick={() => close(false)} style={{ marginLeft: 'auto', marginRight: 0 }}>
              <Close sx={{ alignSelf: 'center', color: '#AAACB3' }} />
            </IconButton>
          </Grid>
          {children}
        </Box>
      </Modal>
    </div>
  );
};
