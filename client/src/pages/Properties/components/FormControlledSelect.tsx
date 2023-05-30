import React, { FC } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

interface IProps {
  label: string;
  name: string;
  control: any;
  values: any[];
}

export const FormControlledSelect: FC<IProps> = ({ control, values, name, label }) => {
  return (
    <FormControl fullWidth variant='outlined' style={{ marginTop: '1rem' }}>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select {...field}>
            {values.map(([key, value]) => {
              return (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        )}
      />
    </FormControl>
  );
};
