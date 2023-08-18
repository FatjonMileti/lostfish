import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import React, { HTMLAttributes } from 'react';
import axios from '../../utils/axios';
import { useUserStore } from '../../globalState/user';

export interface AreaOfInterestProps extends HTMLAttributes<HTMLDivElement> {
  areaOfInterest?: string;
  onAreaChange: (newValue: {
    formattedAddress: string;
    location: { latitude?: number; longitude?: number };
  }) => void;
}

export const AreaOfInterest = styled(({ className, areaOfInterest, onAreaChange }: AreaOfInterestProps) => {
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
      onAreaChange({
        formattedAddress: '',
        location: {}
      });

      debounce(async () => {
        try {
          const { data } = await axios(auth.access_token).get(`/api/map/address/${newAreaOfInterest}`);
          if (data?.formatted_address) {
            onAreaChange({
              formattedAddress: data?.formatted_address,
              location: {
                latitude: data?.geometry?.location?.lat,
                longitude: data?.geometry?.location?.lng
              }
            });
            setSearchValue(data?.formatted_address);
          } else {
            onAreaChange({
              formattedAddress: '',
              location: {}
            });
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
    <div className={className}>
      <Typography variant='body2'>What’s your area of interest?</Typography>

      <TextField
        placeholder='E.g. Bristol or BA1 2LR'
        value={searchValue}
        onChange={({ target: { value } }) => onSearchChange(value)}
      />
    </div>
  );
})`
  & {
    display: grid;
    justify-items: center;
    row-gap: 32px;

    .text-field {
      width: 440px;
    }
  }
`;
