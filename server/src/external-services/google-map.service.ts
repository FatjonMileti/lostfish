import axios from 'axios';
import config from '../config';
import createError from 'http-errors';

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

export default {
  getNearestPlacesByType,
  getCoordinates
};
