import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name: string, values: readonly string[], theme: Theme) {
  return {
    fontWeight: values.includes(name) ? 'bold' : '',
    color: values.includes(name) ? 'green' : ''
  };
}

export const SelectMultiple = (props: {
  values: string[];
  defaultValue: string[];
  label: string;
  onChange: (values: string[]) => void;
  hasError?: boolean;
  readOnly?: boolean;
}) => {
  const { values, defaultValue, onChange, label } = props;
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value }
    } = event;
    setSelectedValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onChange(typeof value === 'string' ? [value] : value);
  };

  React.useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  return (
    <div>
      <FormControl sx={{ marginTop: 2, width: 300 }}>
        <InputLabel id='user-role-label'>{label}</InputLabel>
        <Select
          labelId='value-label'
          multiple
          value={selectedValues}
          onChange={handleChange}
          readOnly={props.readOnly ?? false}
          error={props?.hasError ?? false}
          input={<OutlinedInput id='select-multiple-roles' label='Rol' />}
          size={selectedValues.length === 0 ? 'medium' : 'small'}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} color='success' />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}>
          {values.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, selectedValues, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
