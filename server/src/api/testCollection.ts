import { Router, Request, Response } from 'express';
const router: Router = Router();
import * as joi from 'joi';
import validator from '../middleware/validator';
import createError, { HttpError } from 'http-errors';
import authorize from '../middleware/authorize';
import TestCollection, { ITestCollection } from '../data/testCollection';
import { TestCollectionLog, LogAction } from '../data/logs';
import paging from '../middleware/paging';
import { UploadedFile } from 'express-fileupload';
const path = require('path');

/**
 * @api {get} /api/testCollection/:id Get by Id
 * @apiDescription Get testCollection
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection/:id
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.get('/:id', authorize(), async (req: Request, res: Response) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const id = req.params.id;
    const item = await TestCollection.findOne({ _id: id }, null, {
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
    if (!item) {
        throw createError(400, 'The item does not exist');
    }

    await new TestCollectionLog({
        user: res.locals.userId,
        action: LogAction.Read,
        ref: id,
        info: null
    }).save();
    return res.json(item);
});

/**
 * @api {get} /api/testCollection Get
 * @apiDescription Get all testCollections
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection
 *
 * @apiQuery {string} [search] search
 *
 * @apiPermission authorize
 * @apiUse bearer
 * @apiUse paging
 */
router.get('/', authorize(), paging({ sort: { createdAt: -1 } }), async (req: Request, res: Response) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { search } = req.query;
    const query: {
        $or?: { [key: string]: RegExp }[];
    } = {};

    if (search) {
        query.$or = [
            { firstName: new RegExp(<string>search, 'i') },
            { lastName: new RegExp(<string>search, 'i') }
        ];
    }

    const response = await TestCollection.paginate(query, {
        ...res.locals.pagingOptions,
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
    await new TestCollectionLog({
        user: res.locals.userId,
        action: LogAction.Read,
        ref: null,
        info: req.query
    }).save();
    return res.json(response);
});

/**
 * @api {post} /api/testCollection Post
 * @apiDescription Add a new testCollection
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection
 *
 * @apiBody {string} uniqueId `CNP` or `CUI`
 * @apiBody {string} [firstName]
 * @apiBody {string} [lastName]
 * @apiBody {boolean} [isCompany=false]
 * @apiBody {string} [companyName]
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.post(
    '/',
    authorize(),
    validator(
        joi
            .object({
                uniqueId: joi.string().required(),
                isCompany: joi.boolean().optional(),
                firstName: joi.string().optional(),
                lastName: joi.string().optional(),
                companyName: joi.string().optional()
            })
            .unknown()
    ),
    async (req: Request, res: Response) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const model = <ITestCollection>res.locals.model;

        const existingProspect = await TestCollection.findOne({ uniqueId: model.uniqueId });
        if (existingProspect) throw createError(400, 'CNP/CUI este deja inregistrat');

        const item: ITestCollection = await new TestCollection({
            uniqueId: model.uniqueId,
            isCompany: model.isCompany,
            firstName: model.firstName,
            lastName: model.lastName,
            companyName: model.companyName,
            createdBy: res.locals.userId
        }).save();
        await new TestCollectionLog({
            user: res.locals.userId,
            action: LogAction.Create,
            ref: item._id,
            info: model
        }).save();

        return res.json(item);
    }
);

/**
 * @api {put} /api/testCollection/:id Put
 * @apiDescription Edit testCollection
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection/:id
 *
 * @apiBody {string} uniqueId `CNP` or `CUI`
 * @apiBody {string} [firstName]
 * @apiBody {string} [lastName]
 * @apiBody {boolean} [isCompany=false]
 * @apiBody {string} [companyName]
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.put(
    '/:id',
    authorize(),
    validator(
        joi
            .object({
                uniqueId: joi.string().required(),
                isCompany: joi.boolean().optional(),
                firstName: joi.string().optional(),
                lastName: joi.string().optional(),
                companyName: joi.string().optional()
            })
            .unknown()
    ),
    async (req: Request, res: Response) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const id = req.params.id;
        const model = <ITestCollection>res.locals.model;

        const item = await TestCollection.findOne({ _id: id });
        if (!item) {
            throw createError(400, 'The item does not exist');
        }
        const existingProspect = await TestCollection.findOne({ uniqueId: model.uniqueId, _id: { $ne: id } });
        if (existingProspect) {
            throw createError(400, 'CNP/CUI este deja inregistrat');
        }

        item.uniqueId = model.uniqueId;
        item.isCompany = model.isCompany;
        item.firstName = model.firstName;
        item.lastName = model.lastName;
        item.companyName = model.companyName;
        item.editedAt = new Date();
        item.editedBy = res.locals.userId;
        await item.save();
        await new TestCollectionLog({
            user: res.locals.userId,
            action: LogAction.Update,
            ref: id,
            info: model
        }).save();

        return res.json(item);
    }
);

/**
 * @api {delete} /api/testCollection/:id Delete
 * @apiDescription Delete testCollection
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection/:id
 *
 * @apiPermission authorize
 * @apiUse bearer
 */
router.delete('/:id', authorize(), async (req: Request, res: Response) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const id = req.params.id;
    const item = await TestCollection.findOne({ _id: id });
    if (!item) {
        throw createError(400, 'The item does not exist');
    }

    await new TestCollectionLog({
        user: res.locals.userId,
        action: LogAction.Delete,
        ref: id,
        info: item.toObject()
    }).save();
    await item.delete();

    return res.json({ success: true });
});

/**
 * @api {post} /api/testCollection/upload Upload
 * @apiDescription Upload a file
 * @apiGroup Test Collection
 * @apiSampleRequest /api/testCollection/upload
 *
 * @apiParam {File} image `test it using postman`
 *
 * @apiPermission anonymous
 */
router.post('/upload', async (req: Request, res: Response) => {
    if (!req.files || !req.files.image || !req.files.image)
        return res.status(400).json({ message: 'image is required' });

    const images: UploadedFile | UploadedFile[] = req.files.image;
    let image: UploadedFile;
    if (images instanceof Array) {
        image = images[0];
    } else {
        image = images;
    }

    await new Promise<void>((resolve, reject) => {
        image.mv(path.join(__dirname, `../../uploads/test.jpg`), (err: any) => {
            if (err) return reject(err);

            return resolve();
        });
    });

    return res.status(200).json({ success: true });
});

module.exports = router;
