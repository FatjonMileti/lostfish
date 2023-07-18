import express, { Request, Response } from 'express';
import UserModel from './user.schema';
import { ContactType, Role, UserDocument } from './user.interface';
import createError from 'http-errors';
import mongoose from 'mongoose';
import moment from 'moment';
import httpStatus from 'http-status';
import { hashPassword } from './user.helpers';
import { LoginLog, LoginLogAction } from '../../data/logs';
import accountService from '../Account/services/account.service';
import { validate, ValidationError } from 'class-validator';
import { randomUUID } from 'crypto';
import verifyEmailTamplate from '../../utils/templates/defaultTemplate';
import MailService from '../../utils/email';
import { resetPasswordTemplate } from '../../utils/templates/resetPasswordTemplate';

const mailService = MailService.getInstance();

const getAll = async (req: Request, res: Response) => {
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
  const users = await UserModel.paginate(query, {
    ...res.locals.paging_options,
    select: ['-hash'],
    populate: [
      {
        path: 'created_by',
        select: ['email', 'username', 'firstName', 'lastName']
      },
      {
        path: 'edited_by',
        select: ['email', 'username', 'firstName', 'lastName']
      }
    ]
  });

  res.status(httpStatus.OK).send(users);
};

const getById = async (req: Request, res: Response): Promise<any | undefined> => {
  const id = req.params.id;
  const user: UserDocument | null = await UserModel.findOne({ _id: id }, null, {
    select: ['-hash'],
    populate: [
      {
        path: 'created_by',
        select: ['email', 'username', 'firstName', 'lastName']
      },
      {
        path: 'edited_by',
        select: ['email', 'username', 'firstName', 'lastName']
      }
    ]
  });
  if (!user) {
    throw createError(404, 'The item does not exist');
  }

  res.status(httpStatus.OK).send(mapToUser(user));
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userBody = req.body as UserDocument;

  if (id.toString() !== res.locals?.user_id?.toString()) {
    throw createError(401, { message: 'not_authorized' });
  }

  const user = await findOne({ _id: res.locals.user_id });

  if (!user) {
    throw createError(404, { message: 'user_not_found' });
  }

  if (userBody.first_name) {
    user.first_name = userBody.first_name;
  }

  if (userBody.last_name) {
    user.last_name = userBody.last_name;
  }

  if (userBody.email) {
    user.email = userBody.email;
  }

  if (userBody.phone) {
    user.phone = userBody.phone;
  }

  if (userBody.description) {
    user.description = userBody.description;
  }

  if (userBody.avatar) {
    user.avatar = userBody.avatar;
  }

  if (userBody.notification) {
    user.notification = userBody.notification;
  }

  if (userBody.documents) {
    user.documents = userBody.documents;
  }

  try {
    await user.save();

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }
};

const findOne = async (query: any): Promise<UserDocument | null> => {
  try {
    return await UserModel.findOne({ ...query });
  } catch (error: any) {
    throw createError(httpStatus.BAD_REQUEST, { message: 'error_fetching_user' });
  }
};

const createUser = async (req: Request, res: Response) => {
  const user: UserDocument = req.body as UserDocument;

  const errors: ValidationError[] = await validate(user);

  const existingUser: UserDocument | null = await findOne({
    email: user.email
  });

  if (existingUser) {
    throw createError(400, 'user_already_exists');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const password = req.body.password;
  user.hash = <string>await hashPassword(password);

  user.confirmation_token = randomUUID();
  user.contact_type = ContactType.Client;
  user.address = '';
  user.role = Role.NeWUser;
  try {
    // const contactUser = await offrIoService.createContact(user);
    // if (contactUser) {
    //   user.contact_id = contactUser.id;
    // }

    const userDocument = new UserModel({
      ...user
    });

    const savedUser: UserDocument = await userDocument.save();
    const emailTemplate = verifyEmailTamplate(
      `${process.env.FRONTEND_URL}/activate-account/${user.confirmation_token}`
    );

    // @ts-ignore
    await mailService.sendMail({
      to: user.email,
      subject: 'Test email',
      html: emailTemplate.html
    });

    return res.status(httpStatus.CREATED).json({ ...mapToUser(savedUser), hash: undefined });
  } catch (error: any) {
    res.send(error);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({ message: error?.message ?? 'user_not_deleted' });
  }
};

const resetUserPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user: any = await findOne({ confirmation_token: token });

  if (!user) {
    return res.status(404).json({ message: 'user_not_found' });
  }
  user.hash = <string>await hashPassword(password);

  user.confirmation_token = null;
  await updateUser(user._id.toString(), user);

  const { token: accessToken, refresh } = accountService.generateTokens(user);

  await new LoginLog({
    user: user._id,
    info: user.username,
    action: LoginLogAction.Login
  }).save();

  return res.status(httpStatus.OK).json({
    token_type: 'bearer',
    access_token: accessToken,
    expires_in: process.env.JWT_EXPIRE_SECONDS,
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
  });
};

const sendResetPasswordInstructions = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    const user: any = await findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'user_not_found' });
    }

    user.confirmation_token = randomUUID();

    await user.save();

    const emailTemplate = resetPasswordTemplate({
      link: `${process.env.FRONTEND_URL}/reset-password/${user.confirmation_token}`,
      userName: user.first_name + user.last_name
    });

    // @ts-ignore
    await mailService.sendMail({
      to: user.email,
      subject: 'Reset Password',
      html: emailTemplate.html
    });

    res.status(httpStatus.CREATED).send('ok');
  } catch (err) {
    throw err;
  }
};

const mapToUser = (userDocument: UserDocument): any => {
  return { id: userDocument._id, ...userDocument.toObject() };
};

const getUserPublicData = async (req: Request, res: Response) => {
  const query: {
    is_disabled: boolean;
    role: any;
  } = {
    is_disabled: false,
    role: { $in: [Role.Client, Role.Agent] }
  };

  const users = await UserModel.aggregate([
    {
      $match: query
    },
    {
      $lookup: {
        from: 'criterias',
        localField: '_id',
        foreignField: 'created_by',
        as: 'criteria'
      }
    },
    {
      $unwind: {
        path: '$criteria',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        user_type: {
          $cond: {
            if: { $eq: ['$role', 'Agent'] },
            then: 'Landlord',
            else: 'Client'
          }
        },
        criteria: 1
      }
    }
  ]);

  res.status(httpStatus.OK).send(users);
};

export default {
  getAll,
  getById,
  findOne,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  sendResetPasswordInstructions,
  getUserPublicData
};
