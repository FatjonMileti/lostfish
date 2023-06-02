import express, { response, Router } from 'express';
import axios from 'axios';
import config from '../../config';
import createError from 'http-errors';
const router: Router = Router();

export class MapController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/station', this.getNearestStations);
    this.router.get('/school', this.getNearestSchools);
    this.router.get('/places', this.getNearestImportantPlaces);
    this.router.get('/address/:address/radius/:radius', this.findPlaceWithAddress);
  }

  /**
   * @api {get} /api/map/station Get
   * @apiDescription Get nearest stations
   * @apiGroup Map
   * @apiSampleRequest /api/map/station
   *
   * @apiQuery {string} latitude latitude
   * @apiQuery {string} longitude longitude
   *
   */
  private getNearestStations = async (req: express.Request, res: express.Response) => {
    const queryData: any = req.query;

    try {
      const { data } = await axios.get(
        `${config.map_nearby_url}?location=${queryData.latitude}%2C${queryData.longitude}&rankby=distance&type=train_station&key=${config.google_key}`
      );

      return res.json({ ...data });
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };

  /**
   * @api {get} /api/map/school Get
   * @apiDescription Get nearest stations
   * @apiGroup Map
   * @apiSampleRequest /api/map/school
   *
   * @apiQuery {string} latitude latitude
   * @apiQuery {string} longitude longitude
   *
   */
  private getNearestSchools = async (req: express.Request, res: express.Response) => {
    const queryData: any = req.query;

    try {
      const { data } = await axios.get(
        `${config.map_nearby_url}?location=${queryData.latitude}%2C${queryData.longitude}&rankby=distance&type=school&key=${config.google_key}`
      );

      return res.json({ ...data });
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };

  /**
   * @api {get} /api/map/places Get
   * @apiDescription Get nearest stations
   * @apiGroup Map
   * @apiSampleRequest /api/map/places
   *
   * @apiQuery {string} latitude latitude
   * @apiQuery {string} longitude longitude
   *
   */
  private getNearestImportantPlaces = async (req: express.Request, res: express.Response) => {
    const queryData: any = req.query;

    try {
      const { data } = await axios.get(
        `${config.map_nearby_url}?location=${queryData.latitude}%2C${queryData.longitude}&rankby=distance&type=history&key=${config.google_key}`
      );

      return res.json({ ...data });
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };

  private async getCoordinates(address: string) {
    try {
      const { data } = await axios.get(`${config.map_geocode_url}`, {
        params: {
          address,
          key: config.google_key
        }
      });

      if (data.status === 'OK') {
        /*
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };

         */
        return data.results[0];
      } else {
        throw createError(400, 'Geocoding API request failed');
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      return false;
    }
  }

  private findPlaceWithAddress = async (req: express.Request, res: express.Response) => {
    const address = req.params.address;
    const radius = req.params.radius;
    const coordinates = await this.getCoordinates(address);
    if (!coordinates) {
      throw createError(404, 'Coordinates not found');
    }

    try {
      /*
     const { data } = await axios.get(`${config.map_nearby_url}`, {
       params: {
         location: `${coordinates.latitude},${coordinates.longitude}`,
         radius,
         key: config.google_key
       }
     });
     if (data.status === 'OK') {
       const places = data.results;
       res.json({ ...places });
     } else {
       throw createError(400, 'Places API request failed');
     }

    */
      res.send(coordinates);
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };
}
