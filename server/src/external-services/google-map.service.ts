import axios from 'axios';
import config from '../config/index';

import {
  Client,
  Distance,
  LatLng,
  PlacesNearbyRanking,
  TravelMode
} from '@googlemaps/google-maps-services-js';
import { Place } from '@googlemaps/google-maps-services-js/src/common';

const client = new Client({});

const nearbyMapUrl: string = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const mapGeocodeUrl: string = 'https://maps.googleapis.com/maps/api/geocode/json';

// const getNearestPlacesByType = async (queryData: any, type: string) => {
//   if (!queryData.latitude || !queryData.longitude) {
//     throw createError(400, { message: 'invalid_address' });
//   }
//   const query = `?location=${queryData.latitude}%2C${queryData.longitude}&rankby=distance&type=${type}&key=${config.googleKey}`;
//   const { data } = await axios.get(`${nearbyMapUrl}${query}`);
//   return data;
// };

const getNearestPlacesByType = async ({
  location,
  type
}: {
  location: LatLng;
  type: 'subway_station' | string;
}): Promise<
  {
    place: Place;
    distance?: Distance;
  }[]
> => {
  try {
    const placesResponse = await client.placesNearby({
      params: {
        location,
        radius: 2000,
        type,
        key: config.googleKey
      }
    });

    return Promise.all(
      placesResponse.data.results.slice(0, 3).map(async (result) => {
        if (result.geometry?.location) {
          const distance = await getDistanceFromPlace({
            from: location,
            to: result.geometry?.location
          });

          return {
            place: result,
            distance
          };
        } else {
          return {
            place: result
          };
        }
      })
    );
  } catch (err: any) {
    console.log(err?.code);
    throw err;
  }
};

const getCoordinates = async (address: string) => {
  try {
    const { data } = await axios.get(`${mapGeocodeUrl}`, {
      params: {
        address,
        key: config.googleKey
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
    const { data } = await axios.get(`${mapGeocodeUrl}`, {
      params: {
        latlng: `${lat},${lng}`,
        key: config.googleKey
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
        country_code: countryCode === 'GB' ? 'GBR' : countryCode,
        text: formatedAddress
      };
    } else {
      return null;
    }
  } catch (error: any) {
    return false;
  }
};

const getDistanceFromPlace = async ({
  from,
  to
}: {
  from: LatLng;
  to: LatLng;
}): Promise<Distance | undefined> => {
  try {
    const distanceResponse = await client.distancematrix({
      params: {
        origins: [from],
        destinations: [to],
        mode: TravelMode.walking,
        key: config.googleKey
      }
    });
    return distanceResponse.data.rows?.[0]?.elements?.[0]?.distance;
  } catch (err) {}
};

const getDistanceFrom = async ({
  origin,
  type,
  travelMode = TravelMode.walking
}: {
  origin: LatLng;
  type: 'subway_station' | string;
  travelMode?: TravelMode;
}): Promise<Distance | undefined> => {
  try {
    const placesResponse = await client.placesNearby({
      params: {
        location: origin,
        radius: 2000,
        type,
        key: config.googleKey
      }
    });

    if (placesResponse.data.results?.[0]?.geometry?.location) {
      const subwayLocation = placesResponse.data.results[0].geometry.location;

      const distanceResponse = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [subwayLocation],
          mode: travelMode,
          key: config.googleKey
        }
      });

      return distanceResponse.data.rows[0].elements[0].distance;
    } else {
      console.log(`No subway ${type} found nearby.`);
    }
  } catch (err: any) {
    console.log(err);
  }
};

export default {
  getNearestPlacesByType,
  getCoordinates,
  getAddress,

  getDistanceFrom
};
