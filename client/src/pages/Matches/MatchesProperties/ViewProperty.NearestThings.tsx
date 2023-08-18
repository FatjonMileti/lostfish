import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Button } from '../../../components/Button';
import axios from 'axios';
import config from '../../../config';
import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
interface NearestThingsProps extends HTMLAttributes<HTMLElement> {
  location: {
    lat: number;
    lng: number;
  };
}
export const NearestThings = styled(({ className, location }: NearestThingsProps) => {
  const [selectedButton, setSelectedButton] = React.useState('stations');
  const [stations, setStations] = React.useState<{ name: string }[]>([]);
  const [schools, setSchools] = React.useState<{ name: string }[]>([]);
  const [importantPlaces, setImportantPlaces] = React.useState<{ name: string }[]>([]);

  React.useEffect(() => {
    if (location.lat && location.lng) {
      getNearestStations();
      getNearestSchools();
      getImportantPlaces();
    }
  }, [location.lat, location.lng]);

  const getNearestStations = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/api/map/station`, {
        params: {
          latitude: location.lat,
          longitude: location.lng
        }
      });

      if (data.status === 'OK') setStations(data.results);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getNearestSchools = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/api/map/school`, {
        params: {
          latitude: location.lat,
          longitude: location.lng
        }
      });

      if (data.status === 'OK') setSchools(data.results);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getImportantPlaces = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/api/map/places`, {
        params: {
          latitude: location.lat,
          longitude: location.lng
        }
      });

      if (data.status === 'OK') setImportantPlaces(data.results);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={classNames('nearest-things', className)}>
      <div className='buttons-wrapper'>
        <Button
          variant='primary'
          inverted
          size='large'
          onClick={() => setSelectedButton('stations')}
          active={selectedButton === 'stations'}>
          Nearest stations
        </Button>
        <Button
          variant='primary'
          inverted
          size='large'
          onClick={() => setSelectedButton('Schools')}
          active={selectedButton === 'Schools'}>
          Nearest schools
        </Button>
        <Button
          variant='primary'
          inverted
          size='large'
          onClick={() => setSelectedButton('ImportantPlaces')}
          active={selectedButton === 'ImportantPlaces'}>
          Important places
        </Button>
      </div>
      <div className='nearest-locations'>
        {selectedButton === 'stations' ? (
          <>
            {stations.slice(0, 3).map((station, stationsIndex) => (
              <div key={stationsIndex} className='location'>
                <Icon icon='bus' />
                <Typography variant='body4'>{station.name}</Typography>
              </div>
            ))}
          </>
        ) : selectedButton === 'Schools' ? (
          <>
            {schools.slice(0, 3).map((station, schoolIndex) => (
              <div key={schoolIndex} className='location'>
                <Typography variant='body4' key={schoolIndex}>
                  {station.name}
                </Typography>
              </div>
            ))}
          </>
        ) : selectedButton === 'ImportantPlaces' ? (
          <>
            {importantPlaces.slice(0, 3).map((station, stationIndex) => (
              <div key={stationIndex} className='location'>
                <Typography variant='body4' key={stationIndex}>
                  {station.name}
                </Typography>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
})`
  &.nearest-things {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 24px;

    .buttons-wrapper {
      display: flex;
      padding: 4px;
      align-items: flex-start;
      border-radius: 2500px;
      border: 1px solid #e7e7e7;

      .active {
        background: #eee0d3;
        font-weight: 600;
      }

      button {
        font-weight: 400;
        font-size: 16px;
        padding: 12px 16px;
        line-height: 24px;
        height: auto;
      }

      button:hover {
        background: #eee0d3;
      }
    }

    .nearest-locations {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .location {
        font-weight: 700;

        display: flex;
        column-gap: 8px;
      }
    }
  }
`;
