import express, { Router } from 'express';
import axios from '../../request';
import config from '../../config';
import createError from 'http-errors';
import AttributeSchema from './attribute.schema';
import { AttributeDocument } from './attribute.interface';
const router: Router = Router();

export class AttributeController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.findAll);
    this.router.post('/', this.createAttribute);
  }

  /**
   * @api {get} /api/attribute Get
   * @apiDescription Get attributes
   * @apiGroup Attribute
   * @apiSampleRequest /api/attribute
   *
   */
  private findAll = async (req: express.Request, res: express.Response) => {
    try {
      // const response = await axios.get('/attribute/get');
      const data = await AttributeSchema.paginate({});
      return res.send(data);
    } catch (error: any) {
      return res.status(400).send({ message: 'failed_to_fetch_data', error });
    }
  };

  /**
   * @api {post} /api/attribute Post
   * @apiDescription Add a new attribute
   * @apiGroup Attribute
   * @apiSampleRequest /api/attribute
   *
   * @apiBody {string} name
   * @apiBody {string} label
   * @apiBody {string} description
   * @apiBody {string} fieldset
   * @apiBody {string} type
   * @apiBody {boolean} required
   * @apiBody {string} multiple
   * @apiBody {string} max_length
   * @apiBody {string} min_value
   * @apiBody {string} max_value
   * @apiBody {object} option
   * @apiBody {string} name
   *
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private createAttribute = async (req: express.Request, res: express.Response) => {
    const data = req.body as AttributeDocument;
    try {
      const response = await axios.post('/attribute/post', data);
      if (response.status === 201) {
        data.attribute_id = response.data.id;
        await AttributeSchema.create(data);
        return res.send(response.data);
      }

      return res.status(response.status).send(response.data);
    } catch (error: any) {
      return res.status(400).send({ message: 'failed_to_store_in_offr_io', error });
    }
  };
}
