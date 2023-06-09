import { Router } from 'express';
import attributeService from './services/attribute.service';
const router: Router = Router();

export class AttributeController {
  public router = router;
  public attributeService = attributeService;
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
  private findAll = this.attributeService.findAll;
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
  private createAttribute = this.attributeService.createAttribute;
}
