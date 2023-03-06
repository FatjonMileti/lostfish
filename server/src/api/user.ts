import { Router, Request, Response } from 'express';
const router: Router = Router();
import * as joi from 'joi';
import validator from '../middleware/validator';
import createError from 'http-errors';
import authorize from '../middleware/authorize';
import { LogAction, UserLog } from '../data/logs';
import paging from '../middleware/paging';
import { Role } from '../enums';
import User, { IUser } from '../data/user';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';

/**
 * @api {get} /api/user/:id Get by Id
 * @apiDescription Get user
 * @apiGroup User
 * @apiSampleRequest /api/user/:id
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.get('/:id', authorize([Role.Admin]), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }, null, {
        select: ['-hash'],
        populate: [
            {
                path: 'createdBy',
                select: ['email', 'username', 'firstName', 'lastName']
            },
            {
                path: 'editedBy',
                select: ['email', 'username', 'firstName', 'lastName']
            }
        ]
    });
    if (!user) {
        throw createError(400, 'The item does not exist');
    }

    await new UserLog({
        user: res.locals.userId,
        action: LogAction.Read,
        ref: id,
        info: null
    }).save();
    return res.json(user);
});

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
router.get(
    '/',
    authorize([Role.Admin]),
    paging({ sort: { createdAt: -1 } }),
    async (req: Request, res: Response) => {
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
        //#endregion

        const response = await User.paginate(query, {
            ...res.locals.pagingOptions,
            select: ['-hash'],
            populate: [
                {
                    path: 'createdBy',
                    select: ['email', 'username', 'firstName', 'lastName']
                },
                {
                    path: 'editedBy',
                    select: ['email', 'username', 'firstName', 'lastName']
                }
            ]
        });
        await new UserLog({
            user: res.locals.userId,
            action: LogAction.Read,
            ref: null,
            info: req.query
        }).save();
        return res.json(response);
    }
);

const generatePassword = (
    length: number = Math.floor(Math.random() * 2) + 6, //6-8 characters
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => chars[x % chars.length])
        .join('');

/**
 * @api {post} /api/user Post
 * @apiDescription Add a new user
 * @apiGroup User
 * @apiSampleRequest /api/user
 *
 * @apiBody {string=admin} role
 * @apiBody {string} email
 * @apiBody {string} [phone]
 * @apiBody {string} firstName
 * @apiBody {string} lastName
 *
 * @apiBody {boolean} [isDisabled=false]
 *
 * @apiPermission admin
 * @apiUse bearer
 */
router.post(
    '/',
    authorize([Role.Admin]),
    validator(
        joi
            .object({
                role: joi.string().required().valid(Role.Admin),
                email: joi.string().email().required(),
                phone: joi.string().optional(),
                firstName: joi.string().required(),
                lastName: joi.string().required(),
                isDisabled: joi.boolean().optional()
            })
            .unknown()
    ),
    async (req: Request, res: Response) => {
        const model = <IUser>res.locals.model;

        const existingUser = await User.findOne({ username: model.email });
        if (existingUser) {
            throw createError(400, 'User already exists');
        }

        const password: string = generatePassword();
        const hash: string = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 12, (err, generatedHash) => {
                if (err) return reject(err);

                resolve(generatedHash);
            });
        });

        //TODO: send email to user with the generated password
        console.log('password:', password);

        const item: IUser = await new User({
            username: model.email,
            hash,
            role: <Role>model.role,
            email: model.email,
            phone: model.phone,
            firstName: model.firstName,
            lastName: model.lastName,
            isDisabled: model.isDisabled || false,
            createdBy: res.locals.userId
        }).save();
        await new UserLog({
            user: res.locals.userId,
            action: LogAction.Create,
            ref: item._id,
            info: model
        }).save();

        return res.json({ ...item.toObject(), hash: undefined });
    }
);

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
 *
 * @apiPermission admin
 * @apiUse bearer
 */
router.put(
    '/:id',
    authorize([Role.Admin]),
    validator(
        joi
            .object({
                role: joi.string().required().valid(Role.Admin),
                email: joi.string().email().required(),
                phone: joi.string().optional(),
                firstName: joi.string().required(),
                lastName: joi.string().required(),
                isDisabled: joi.boolean().optional()
            })
            .unknown()
    ),
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const model = <IUser>res.locals.model;

        const item = await User.findOne({ _id: id });
        if (!item) {
            throw createError(400, 'The item does not exist');
        }
        const existingUser = await User.findOne({ username: model.email, _id: { $ne: id } });
        if (existingUser) {
            throw createError(400, 'User already exists');
        }
        const hash = item.hash;

        item.username = model.email;
        item.hash = hash;
        item.role = <Role>model.role;
        item.email = model.email;
        item.phone = model.phone;
        item.firstName = model.firstName;
        item.lastName = model.lastName;
        item.isDisabled = model.isDisabled || false;
        item.editedAt = new Date();
        item.editedBy = res.locals.userId;
        await item.save();
        await new UserLog({
            user: res.locals.userId,
            action: LogAction.Update,
            ref: id,
            info: model
        }).save();

        return res.json({ ...item.toObject(), hash: undefined });
    }
);

/**
 * @api {delete} /api/user/:id Delete
 * @apiDescription Delete user
 * @apiGroup User
 * @apiSampleRequest /api/user/:id
 *
 * @apiPermission admin
 * @apiUse bearer
 */
router.delete('/:id', authorize([Role.Admin]), async (req: Request, res: Response) => {
    const id = req.params.id;
    const item = await User.findOne({ _id: id });
    if (!item) {
        throw createError(400, 'The item does not exist');
    }

    await new UserLog({
        user: res.locals.userId,
        action: LogAction.Delete,
        ref: id,
        info: item.toObject()
    }).save();
    await item.delete();

    return res.json({ success: true });
});

module.exports = router;
