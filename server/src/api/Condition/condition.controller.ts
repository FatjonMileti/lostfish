import express, { Router } from 'express';
import axios from '../../request';
import ConditionSchema from './condition.schema';
import { ConditionDocument } from './condition.interface';
const router: Router = Router();

export class ConditionController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.findAll);
    this.router.post('/', this.createCondition);
  }

  /**
   * @api {get} /api/condition Get
   * @apiDescription Get condition
   * @apiGroup Condition
   * @apiSampleRequest /api/condition
   *
   */
  private findAll = async (req: express.Request, res: express.Response) => {
    try {
      /*
      const response = await axios.get('/condition/get');

      const dataToUpdate = response.data.items.map((data: any) => {
        return {
          updateOne: {
            filter: { condition_id: data.id },
            update: {
              ...data
            },
            upsert: true
          }
        };
      });
      await ConditionSchema.bulkWrite(dataToUpdate, { ordered: false });

       */

      const responseData = await ConditionSchema.paginate({ required: true, is_system: true });
      return res.send(responseData);
    } catch (error: any) {
      return res.status(400).send({ message: 'failed_to_fetch_data', error });
    }
  };

  /**
   * @api {post} /api/condition Post
   * @apiDescription Add a new condition
   * @apiGroup Condition
   * @apiSampleRequest /api/condition
   *
   * @apiBody {string} name
   * @apiBody {string} label
   * @apiBody {string} description
   * @apiBody {string} fieldset
   * @apiBody {string} type_string
   * @apiBody {boolean} required
   *
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private createCondition = async (req: express.Request, res: express.Response) => {
    const data = req.body as ConditionDocument;
    try {
      const response = await axios.post('/condition/post', data);
      if (response.status === 201) {
        data.condition_id = response.data.id;
        await ConditionSchema.create(data);
        return res.send(response.data);
      }

      return res.status(response.status).send(response.data);
    } catch (error: any) {
      return res.status(400).send({ message: 'failed_to_store_in_offr_io', error });
    }
  };
}
