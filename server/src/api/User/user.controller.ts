import express, { Router } from "express";
import userService from "./user.service";
import { UserDocument } from "../../data/interfaces/user.interface";
import { validate, ValidationError } from "class-validator";
import { LogAction, UserLog } from "../../data/logs";
import { Role } from "../../enums";
import moment from "moment/moment";
import authorize from "../../middleware/authorize";
import paging from "../../middleware/paging";
import createError from "http-errors";

import { generatePassword, hashPassword } from "./user.helpers";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

const router: Router = Router();

export class UserController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      authorize([Role.Admin]),
      paging({ sort: { created_at: -1 } }),
      this.getAll
    );
    this.router.get("/:id", authorize([Role.Admin]), this.getById);
    this.router.post("/", this.create);
    this.router.put("/invitation", this.acceptInvitation);
    this.router.put("/:id", authorize([Role.Admin]), this.update);
    this.router.delete("/:id", authorize([Role.Admin]), this.delete);
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
        { firstName: new RegExp(<string>search, "i") },
        { lastName: new RegExp(<string>search, "i") },
        { phone: new RegExp(<string>search, "i") },
        { email: new RegExp(<string>search, "i") },
      ];
    }

    const { is_disabled, role } = req.query;
    let createdAtSince: any | null = req.query.created_atSince;
    let createdAtUntil: any | null = req.query.created_atUntil;

    if (is_disabled) {
      query.is_disabled = is_disabled === "true";
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
      info: null,
    }).save();

    res.json(user);
  };

  /**
   * @api {put} /api/user/invitation Accept invitation
   * @apiDescription Accept invitation
   * @apiGroup User
   * @apiSampleRequest /api/user/invitation
   * @apiBody {string} password
   * @apiBody {string} token
   *
   */
  private acceptInvitation = async (
    req: express.Request,
    res: express.Response
  ) => {
    const token = req.body.token;
    const password = req.body.password;

    const user: any = await userService.findOne({ confirmation_token: token });

    if (!user) {
      return res.status(404).json({ message: "user_not_found" });
    }

    user.hash = <string>await hashPassword(password);
    user.is_disabled = false;

    await userService.updateUser(user._id.toString(), user);

    return res.json({ ...user._doc, hash: undefined });
  };

  /**
   * @api {post} /api/user Post
   * @apiDescription Register
   * @apiGroup User
   * @apiSampleRequest /api/user
   * @apiBody {string} email
   * @apiBody {string} [phone]
   * @apiBody {string} first_name
   * @apiBody {string} last_name
   *
   */
  private create = async (req: express.Request, res: express.Response) => {
    const user: UserDocument = req.body as UserDocument;

    const errors: ValidationError[] = await validate(user);

    const existingUser: UserDocument | null = await userService.findOne({
      email: user.email,
    });
    if (existingUser) {
      throw createError(400, "user_already_exists");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // const password: string = generatePassword();
    // user.hash = <string>await hashPassword(password);

    user.confirmation_token = randomUUID();

    const createdUser: UserDocument = await userService.create(user);

    // await new UserLog({
    //   user: res.locals.user_id,
    //   action: LogAction.Create,
    //   ref: createdUser._id,
    //   info: createdUser,
    // }).save();

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
      const updatedUser: UserDocument | undefined =
        await userService.updateUser(id, user);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ message: "User not found" });
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
      res.status(404).json({ message: "User not found" });
    }
  };
}
