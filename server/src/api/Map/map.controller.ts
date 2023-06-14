import express, { Router } from 'express';
import createError from 'http-errors';
const router: Router = Router();
import googleMapService from '../../external-services/google-map.service';
export class MapController {
  public router = router;
  public googleMapService = googleMapService;
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
      const data = await this.googleMapService.getNearestPlacesByType(queryData, 'train_station');

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
      const data = await this.googleMapService.getNearestPlacesByType(queryData, 'school');

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
      const data = await this.googleMapService.getNearestPlacesByType(queryData, 'history');

      return res.json({ ...data });
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };

  private findPlaceWithAddress = async (req: express.Request, res: express.Response) => {
    const address = req.params.address;
    /* TODO How we will use radius ?*/
    const radius = req.params.radius;
    const coordinates = await this.googleMapService.getCoordinates(address);
    if (!coordinates) {
      throw createError(404, 'Coordinates not found');
    }

    try {
      res.send(coordinates);
    } catch (error: any) {
      return res.status(400).send(error?.request?.data);
    }
  };
}
