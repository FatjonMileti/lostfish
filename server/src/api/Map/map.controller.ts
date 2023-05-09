import express, { Router } from "express";
import axios from "axios";
import config from "../../config";
const router: Router = Router();

export class MapController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/station", this.getNearestStations);
    this.router.get("/school", this.getNearestSchools);
    this.router.get("/places", this.getNearestImportantPlaces);
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
  private getNearestStations = async (
    req: express.Request,
    res: express.Response
  ) => {
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
  private getNearestSchools = async (
    req: express.Request,
    res: express.Response
  ) => {
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
  private getNearestImportantPlaces = async (
    req: express.Request,
    res: express.Response
  ) => {
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
}
