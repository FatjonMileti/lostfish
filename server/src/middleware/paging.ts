import { Request, Response, NextFunction } from 'express';

export default (defaultOptions: object = {}) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { page, pageSize, sort, asc } = req.query;

        //default page
        let options: object = {
            pagination: false,
            lean: true,
            sort: { createdAt: -1 },
            ...defaultOptions
        };
        if (page && pageSize) {
            options = {
                ...options,
                pagination: true,
                page: parseInt(<string>page, 10),
                limit: parseInt(<string>pageSize, 10)
            };
        }
        if (sort) {
            options = {
                ...options,
                sort: { [<string>sort]: asc === 'true' ? 1 : -1 }
            };
        }

        res.locals.pagingOptions = options;
        return next();
    };
