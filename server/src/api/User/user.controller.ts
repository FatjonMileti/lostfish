import { Router } from 'express';
import userService from './user.service';
import paging from '../../middleware/paging';
import ability, { checkUpdateUserPermission } from '../../middleware/ability.middleware';
import { CASLAction } from '../../casl/casl.interface';

const router: Router = Router();

export class UserController {
  public router = router;
  private userService = userService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', ability(CASLAction.Read, 'User'), paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/:id', ability(CASLAction.Read, 'User'), this.getById);
    this.router.post('/register', this.create);
    this.router.patch('/:id', checkUpdateUserPermission, this.updateUser);
    this.router.delete('/', ability(CASLAction.Delete, 'User'), this.delete);
    this.router.post(
      '/forgot-password',
      ability(CASLAction.Update, 'User'),
      this.sendResetPasswordInstructions
    );
    this.router.post('/reset-password', ability(CASLAction.Update, 'User'), this.resetPassword);
  }

  /**
   * @api {get} /api/user Get
   * @apiDescription Get all users
   * @apiGroup User
   * @apiSampleRequest /api/user
   *
   * @apiPermission admin
   * @apiUse bearer
   * @apiUse paging
   *
   * @apiQuery {string} [search] search by firstName, lastName, phone, email
   *
   * @apiQuery {boolean} [isDisabled] filter
   * @apiQuery {string} [role] filter
   * @apiQuery {date} [createdAtSince] filter
   * @apiQuery {date} [createdAtUntil] filter
   */

  private getAll = this.userService.getAll;

  /**
   * @api {get} /api/user/:id Get by Id
   * @apiDescription Get user
   * @apiGroup User
   * @apiSampleRequest /api/user/:id
   *
   * @apiParam id user id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getById = this.userService.getById;

  /**
   * @api {put} /api/user/invitation Accept invitation
   * @apiDescription Accept invitation
   * @apiGroup User
   * @apiSampleRequest /api/user/invitation
   * @apiBody {string} token
   *
   */
  private resetPassword = this.userService.resetUserPassword;

  /**
   * @api {post} /api/user Create new user
   * @apiDescription Create new user
   * @apiGroup User
   * @apiSampleRequest /api/user
   * @apiBody {string} first_name
   * @apiBody {string} last_name
   * @apiBody {string} email
   * @apiBody {string} password
   *
   * @apiPermission authorize
   * @apiUse bearer
   */
  private create = this.userService.createUser;

  /**
   * @api {patch} /api/user/:id Patch user
   * @apiDescription Edit user
   * @apiGroup User
   * @apiSampleRequest /api/user/:id
   *
   * @apiBody {string=admin} role
   * @apiBody {string} email
   * @apiBody {string} [phone]
   * @apiBody {string} firstName
   * @apiBody {string} lastName
   *
   * @apiBody {boolean} [isDisabled=false]
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */
  private updateUser = this.userService.updateUser;

  /**
   * @api {delete} /api/user Delete
   * @apiDescription Delete user
   * @apiGroup User
   * @apiSampleRequest /api/user
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = this.userService.deleteUser;

  /**
   * @api {post} /api/user/forgot-password Forgot Password
   * @apiDescription sends recover account instructions
   * @apiGroup User
   * @apiSampleRequest /api/user/forgot-password
   * @apiBody {string} email
   */

  private sendResetPasswordInstructions = this.userService.sendResetPasswordInstructions;
}
