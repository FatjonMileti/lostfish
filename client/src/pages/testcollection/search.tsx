import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export default (props: { openModal: () => void; search: (value: string) => void }) => {
  const [searchTimeout, setSearchTimeout] = useState<any | null>(null);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchTimeout(
      setTimeout(() => {
        props.search(value);
      }, 300)
    );
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Box>
      <Typography variant='h1' component='h1'>
        Test collections
      </Typography>

      <TextField
        variant='standard'
        placeholder='Search'
        onChange={handleSearch}
        InputProps={{
          startAdornment: <SearchOutlinedIcon sx={{ mr: '0.7rem', color: '#505259' }} />,
          disableUnderline: true
        }}
      />

      <Box>
        <Button onClick={() => props.openModal()}>Add</Button>
      </Box>
    </Box>
  );
};
