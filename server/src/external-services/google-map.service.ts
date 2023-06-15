import axios from 'axios';
import config from '../config';
import createError from 'http-errors';
import { CountryCode } from '../api/Asset/asset.interface';

const getNearestPlacesByType = async (queryData: any, type: string) => {
  if (!queryData.latitude || !queryData.longitude) {
    throw createError(400, { message: 'invalid_address' });
  }
  const url = config.map_nearby_url;
  const query = `?location=${queryData.latitude}%2C${queryData.longitude}&rankby=distance&type=${type}&key=${config.google_key}`;
  const { data } = await axios.get(`${url}${query}`);
  return data;
};

const getCoordinates = async (address: string) => {
  try {
    const { data } = await axios.get(`${config.map_geocode_url}`, {
      params: {
        address,
        key: config.google_key
      }
    });

    if (data.status === 'OK') {
      return data.results[0];
    } else {
      return [];
    }
  } catch (error: any) {
    return false;
  }
};

const getAddress = async (lat: number, lng: number) => {
  try {
    const { data } = await axios.get(`${config.map_geocode_url}`, {
      params: {
        latlng: `${lat},${lng}`,
        key: config.google_key
      }
    });

    if (data.status === 'OK') {
      const firstResponse = data.results[0].address_components;
      const route = firstResponse.find((item: any) => item.types.includes('street_number'))?.long_name;
      const streetNumber = firstResponse.find((item: any) => item.types.includes('street_number'))?.long_name;
      const administrativeAreaLevelOne = firstResponse.find((item: any) =>
        item.types.includes('administrative_area_level_1')
      )?.long_name;
      const postalCode = firstResponse.find((item: any) => item.types.includes('postal_code'))?.long_name;
      const formatedAddress = data.results[0]?.formatted_address;
      const countryCode = firstResponse.find((item: any) => item.types.includes('country'))?.short_name;
      const postalTown = firstResponse.find((item: any) => item.types.includes('postal_town'))?.long_name;
      return {
        latitude: lat,
        longitude: lng,
        street_number: streetNumber,
        route,
        neighbourhood: '',
        postal_town: postalTown,
        postal_code: postalCode,
        administrative_area_level_1: administrativeAreaLevelOne,
        country_code: countryCode,
        text: formatedAddress
      };
    } else {
      return null;
    }
  } catch (error: any) {
    return false;
  }
};

export default {
  getNearestPlacesByType,
  getCoordinates,
  getAddress
};
