import express, { Router } from 'express';

const router: Router = Router();
import userService from './user.service';
import { UserDocument } from './user.interface';
import { validate } from 'class-validator';
import { LogAction, UserLog } from '../../data/logs';
import { Role } from '../../enums';
import moment from 'moment/moment';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const generatePassword = (
  length: number = Math.floor(Math.random() * 2) + 6, //6-8 characters
  chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join('');

export class UserController {
  public path = '/';
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authorize([Role.Admin]), paging({ sort: { createdAt: -1 } }), this.getAll);
    this.router.get(`${this.path}:id`, authorize([Role.Admin]), this.getById);
    this.router.post(this.path, authorize([Role.Admin]), this.create);
    this.router.put(`${this.path}:id`, authorize([Role.Admin]), this.update);
    this.router.delete(`${this.path}:id`, authorize([Role.Admin]), this.delete);
  }

  private getAll = async (req: express.Request, res: express.Response) => {
    const { search } = req.query;
    const query: {
      // tslint:disable-next-line: no-any
      createdAt?: any;
      isDisabled?: boolean;
      role?: Role;
      $or?: { [key: string]: RegExp }[];
    } = {};

    if (search) {
      query.$or = [
        { firstName: new RegExp(<string>search, 'i') },
        { lastName: new RegExp(<string>search, 'i') },
        { phone: new RegExp(<string>search, 'i') },
        { email: new RegExp(<string>search, 'i') }
      ];
    }

    //#region filter
    // tslint:disable-next-line: no-shadowed-variable
    const { isDisabled, role } = req.query;
    // tslint:disable-next-line: no-any
    let createdAtSince: any | null = req.query.createdAtSince;
    // tslint:disable-next-line: no-any
    let createdAtUntil: any | null = req.query.createdAtUntil;

    if (isDisabled) {
      query.isDisabled = isDisabled === 'true';
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
      if (!query.createdAt) query.createdAt = {};
      query.createdAt.$gt = createdAtSince.toDate();
    }

    if (createdAtUntil) {
      if (!query.createdAt) query.createdAt = {};
      query.createdAt.$lte = createdAtUntil.toDate();
    }

    const users = await userService.getAll(query, res.locals.pagingOptions);
    res.json(users);
  };

  private getById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const user = await userService.getById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new UserLog({ user: res.locals.userId, action: LogAction.Read, ref: id, info: null }).save();

    res.json(user);
  };

  private create = async (req: express.Request, res: express.Response) => {
    const user = req.body as UserDocument;

    const errors = await validate(user);

    const existingUser = await userService.findOne({ username: user.email });
    if (existingUser) {
      throw createError(400, 'User already exists');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const password: string = generatePassword();
    const hash: string = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, (err, generatedHash) => {
        if (err) return reject(err);
        resolve(generatedHash);
      });
    });
    user.hash = hash;
    user.isDisabled = user.isDisabled || false;
    user.createdBy = res.locals.userId;
    const createdUser = await userService.create(user);

    await new UserLog({
      user: res.locals.userId,
      action: LogAction.Create,
      ref: createdUser._id,
      info: createdUser
    }).save();

    return res.json({ ...createdUser, hash: undefined });
  };

  private update = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const user = req.body as UserDocument;

    const errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const updatedUser = await userService.updateUser(id, user);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };

  private delete = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    try {
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };
}
