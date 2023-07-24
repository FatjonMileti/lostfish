import { Request, Response, NextFunction } from 'express';

export interface IPagingOptions {
  pagination: boolean;
  lean: boolean;
  sort: any;
  page?: number;
  limit?: number;
}

export default (defaultOptions: object = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, sort, asc } = req.query;

    //default page
    let options: IPagingOptions = {
      pagination: false,
      lean: true,
      sort: { created_at: -1 },
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

    res.locals.paging_options = options;
    return next();
  };
