import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';

interface ISearchProps {
  search: (value: string) => void;
  filter: (value: any) => void;
}

export const Search = (props: ISearchProps) => {
  const [searchTimeout, setSearchTimeout] = useState<any | null>(null);
  const [radioValue, setRadioValue] = React.useState('all');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };
  const handleSearch = (e: any) => {
    const searchValue = e.target.value;
    setSearchTimeout(
      setTimeout(() => {
        props.search(searchValue);
      }, 300)
    );
  };

  useEffect(() => {
    props.filter({ type: radioValue });
  }, [radioValue]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Box sx={{ pb: '15px' }} style={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            variant='standard'
            placeholder='Search'
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchOutlinedIcon sx={{ mr: '0.7rem', color: '#505259' }} />,
              disableUnderline: true
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <FormControl>
            <FormLabel id='demo-row-radio-buttons-group-label'>Filter</FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
              onChange={handleChange}
              value={radioValue}>
              <FormControlLabel value='all' control={<Radio />} label='All' />
              <FormControlLabel value='lastmonth' control={<Radio />} label='Last month' />
              <FormControlLabel value='lastweek' control={<Radio />} label='Last week' />
              <FormControlLabel value='today' control={<Radio />} label='Today' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
};
