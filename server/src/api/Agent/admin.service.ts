import { PaginateModel } from 'mongoose';
import { IPagingOptions } from '../../middleware/paging';
import { ILog, ILoginLog } from '../../data/logs';

export default class AdminService {
  private userLogModel: PaginateModel<ILoginLog>;
  private assetLogModel: PaginateModel<ILog>;
  constructor(userLogModel: PaginateModel<ILoginLog>, assetLogModel: PaginateModel<ILog>) {
    this.userLogModel = userLogModel;
    this.assetLogModel = assetLogModel;
  }

  public async getAllSessions(query: any, paginateOptions: IPagingOptions): Promise<any> {
    return this.userLogModel.paginate(query, {
      populate: [
        {
          path: 'user',
          select: ['first_name', 'last_name', '_id', 'avatar']
        }
      ],
      ...paginateOptions
    });
  }

  public async getAllPropertyLogsILogs(query: any, paginateOptions: IPagingOptions): Promise<any> {
    return this.assetLogModel.paginate(query, {
      populate: [
        {
          path: 'user',
          select: ['first_name', 'last_name', '_id', 'avatar']
        }
      ],
      ...paginateOptions
    });
  }

  public async getSessionByQuery(query: any): Promise<any | null> {
    return this.userLogModel
      .findOne(query)
      .populate('user', ['_id', 'first_name', 'last_name', 'avatar', 'email'])
      .lean();
  }

  // Update a match by ID
  public async updateMatch(id: string, data: Partial<any>): Promise<any | null> {
    return this.userLogModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Delete a match by ID
  public async deleteMatch(id: string): Promise<any | null> {
    return this.userLogModel.findByIdAndDelete(id).exec();
  }
}
