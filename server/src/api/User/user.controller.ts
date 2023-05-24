import express, { Router } from 'express';
import userService from './user.service';
import { UserDocument } from '../../data/interfaces/user.interface';
import { validate, ValidationError } from 'class-validator';
import { LogAction, LoginLog, LoginLogAction, UserLog } from '../../data/logs';
import { Role } from '../../enums';
import moment from 'moment/moment';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import createError from 'http-errors';
import { hashPassword } from './user.helpers';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import verifyEmailTamplate from '../../utils/templates/defaultTemplate';
import { resetPasswordTemplate } from '../../utils/templates/resetPasswordTemplate';
import MailService from '../../utils/email';
import accountService from '../Account/account.service';

const router: Router = Router();

export class UserController {
  public router = router;
  private accountService = accountService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authorize([Role.Admin]), paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/invitation/:token', this.getInvitation);
    this.router.get('/:id', authorize([Role.Admin]), this.getById);
    this.router.post('/', this.create);

    this.router.put('/:id', authorize([Role.Admin]), this.update);
    this.router.delete('/:id', authorize([Role.Admin]), this.delete);

    this.router.post('/forgot-password', this.sendResetPasswordInstructions);
    this.router.post('/reset-password', this.resetPassword);
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

  private getAll = async (req: express.Request, res: express.Response) => {
    const { search } = req.query;

    const query: {
      created_at?: any;
      is_disabled?: boolean;
      role?: Role;
      $or?: { [key: string]: RegExp }[];
      _id?: any;
    } = {};

    query._id = { $nin: [new mongoose.Types.ObjectId(res.locals.user_id)] };

    if (search) {
      query.$or = [
        { firstName: new RegExp(<string>search, 'i') },
        { lastName: new RegExp(<string>search, 'i') },
        { phone: new RegExp(<string>search, 'i') },
        { email: new RegExp(<string>search, 'i') }
      ];
    }

    const { is_disabled, role } = req.query;
    let createdAtSince: any | null = req.query.created_atSince;
    let createdAtUntil: any | null = req.query.created_atUntil;

    if (is_disabled) {
      query.is_disabled = is_disabled === 'true';
    }

    if (role) {
      query.role = <Role>role.toString();
    }

    if (createdAtSince) {
      const momentCreatedAtSince = moment(createdAtSince.toString());
      if (momentCreatedAtSince.isValid()) {
        createdAtSince = momentCreatedAtSince;
      } else {
        createdAtSince = null;
      }
    }

    if (createdAtUntil) {
      const momentCreatedAtUntil = moment(createdAtUntil.toString());
      if (momentCreatedAtUntil.isValid()) {
        createdAtUntil = momentCreatedAtUntil;
      } else {
        createdAtUntil = null;
      }
    }

    //both
    if (createdAtSince) {
      if (!query.created_at) query.created_at = {};
      query.created_at.$gt = createdAtSince.toDate();
    }

    if (createdAtUntil) {
      if (!query.created_at) query.created_at = {};
      query.created_at.$lte = createdAtUntil.toDate();
    }

    const users = await userService.getAll(query, res.locals.paging_options);
    res.json(users);
  };

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
  private getById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const user = await userService.getById(id);

    await new UserLog({
      user: res.locals.user_id,
      action: LogAction.Read,
      ref: id,
      info: null
    }).save();

    res.json(user);
  };

  /**
   * @api {get} /api/user/invitation/:token Get invitation by token
   * @apiDescription Get Invitation by token
   * @apiGroup User
   * @apiSampleRequest /api/user/invitation/:token
   *
   * @apiParam token user token
   */
  private getInvitation = async (req: express.Request, res: express.Response) => {
    // tslint:disable-next-line:variable-name
    const confirmation_token = req.params.token;
    const user: any = await userService.findOne({ confirmation_token });

    // await new UserLog({
    //   user: res.locals.user_id,
    //   action: LogAction.Read,
    //   ref: id,
    //   info: null,
    // }).save();

    if (!user) {
      return res.status(404).json({ message: 'user_not_found' });
    }

    user.is_disabled = false;
    await user.save();

    const { token, refresh } = this.accountService.generateTokens(user);
    return res.json({
      token_type: 'bearer',
      access_token: token,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
    });
  };

  /**
   * @api {put} /api/user/invitation Accept invitation
   * @apiDescription Accept invitation
   * @apiGroup User
   * @apiSampleRequest /api/user/invitation
   * @apiBody {string} token
   *
   */
  private resetPassword = async (req: express.Request, res: express.Response) => {
    const { token, password } = req.body;

    const user: any = await userService.findOne({ confirmation_token: token });

    if (!user) {
      return res.status(404).json({ message: 'user_not_found' });
    }
    user.hash = <string>await hashPassword(password);

    user.confirmation_token = null;
    await userService.updateUser(user._id.toString(), user);

    const { token: accessToken, refresh } = this.accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.username,
      action: LoginLogAction.Login
    }).save();

    return res.json({
      token_type: 'bearer',
      access_token: accessToken,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
    });
  };

  /**
   * @api {post} /api/user Post
   * @apiDescription Register
   * @apiGroup User
   * @apiSampleRequest /api/user
   * @apiBody {string} first_name
   * @apiBody {string} last_name
   * @apiBody {string} email
   * @apiBody {string} password
   *
   */
  private create = async (req: express.Request, res: express.Response) => {
    const user: UserDocument = req.body as UserDocument;

    const errors: ValidationError[] = await validate(user);

    const existingUser: UserDocument | null = await userService.findOne({
      email: user.email
    });
    if (existingUser) {
      throw createError(400, 'user_already_exists');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // const password: string = generatePassword();
    // user.hash = <string>await hashPassword(password);

    const password = req.body.password;
    user.hash = <string>await hashPassword(password);

    user.confirmation_token = randomUUID();

    const createdUser: UserDocument = await userService.create(user);

    const emailTemplate = verifyEmailTamplate(
      `${process.env.FRONTEND_URL}/activate-account/${user.confirmation_token}`
    );
    const mailService = MailService.getInstance();
    // @ts-ignore
    await mailService.sendMail({
      to: user.email,
      subject: 'Test email',
      html: emailTemplate.html
    });

    return res.json({ ...createdUser, hash: undefined });
  };

  /**
   * @api {put} /api/user/:id Put
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
  private update = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const user = req.body as UserDocument;

    const errors: ValidationError[] = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const updatedUser: UserDocument | undefined = await userService.updateUser(id, user);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };

  /**
   * @api {delete} /api/user/:id Delete
   * @apiDescription Delete user
   * @apiGroup User
   * @apiSampleRequest /api/user/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    try {
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };

  /**
   * @api {post} /api/user/forgot-password Forgot Password
   * @apiDescription sends recover account instructions
   * @apiGroup User
   * @apiSampleRequest /api/user/forgot-password
   * @apiBody {string} email
   */

  private sendResetPasswordInstructions = async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;

      const user: any = await userService.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'user_not_found' });
      }

      user.confirmation_token = randomUUID();

      await userService.updateUser(user._id.toString(), user);

      const emailTemplate = resetPasswordTemplate({
        link: `${process.env.FRONTEND_URL}/reset-password/${user.confirmation_token}`,
        userName: user.first_name + user.last_name
      });

      const mailService = MailService.getInstance();
      // @ts-ignore
      await mailService.sendMail({
        to: user.email,
        subject: 'Reset Password',
        html: emailTemplate.html
      });

      res.status(201).send('ok');
    } catch (err) {
      throw err;
    }
  };
}
