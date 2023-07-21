import { TextField, TextFieldProps } from '../../components/TextField';
import React from 'react';
import axios from '../../utils/axios';
import { useUserStore } from '../../globalState/user';

export interface AreaOfInterestProps extends TextFieldProps {
  areaOfInterest?: string;
  onAreaChange: (newValue: string) => void;
}

export const AreaOfInterest = ({ className, areaOfInterest, onAreaChange, ...rest }: AreaOfInterestProps) => {
  const [searchValue, setSearchValue] = React.useState('');

  const { auth } = useUserStore();

  const debounceRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (areaOfInterest && areaOfInterest !== searchValue) {
      setSearchValue(areaOfInterest);
    }
  }, [areaOfInterest]);

  const debounce = (callback: TimerHandler, delay?: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(callback, delay);
  };

  const onSearchChange = async (newAreaOfInterest: string) => {
    try {
      setSearchValue(newAreaOfInterest);
      onAreaChange('');

      debounce(async () => {
        try {
          const { data } = await axios(auth.access_token).get(`/api/map/address/${newAreaOfInterest}`);
          if (data?.formatted_address) {
            onAreaChange(data?.formatted_address);
            setSearchValue(data?.formatted_address);
          } else {
            onAreaChange('');
          }
        } catch (err) {
          throw err;
        }
      }, 1000);
    } catch (err) {
      throw err;
    }
  };

  return (
    <TextField value={searchValue} onChange={({ target: { value } }) => onSearchChange(value)} {...rest} />
  );
};
