import { PaginateModel } from 'mongoose';
import { MatchDocument } from './match.interface';
import { IMatchQueryParams } from './match.schema';
import { IPagingOptions } from '../../middleware/paging';

const SelectedPropertyFields: string[] = [
  'area_of_interest',
  'radius',
  'asset_address',
  'status_string',
  'transaction_type_string',
  'property_type',
  'floor_size',
  'room_details',
  'property_features',
  'asset_rent',
  'property_images'
];

export default class MatchService {
  private matchModel: PaginateModel<MatchDocument>;

  constructor(matchModel: PaginateModel<MatchDocument>) {
    this.matchModel = matchModel;
  }

  // Create a new match
  public async createMatch(data: Partial<MatchDocument>): Promise<MatchDocument> {
    const match = new this.matchModel(data);
    return match.save();
  }

  // Get all matches
  public async getAllMatches(query: IMatchQueryParams, paginateOptions: IPagingOptions): Promise<any> {
    return this.matchModel.paginate(query, {
      ...paginateOptions,
      populate: [
        {
          path: 'property',
          populate: {
            path: 'created_by',
            select: ['first_name', 'last_name', '_id', 'avatar']
          }
        },
        {
          path: 'tenant',
          select: ['first_name', 'last_name', '_id', 'avatar']
        },
        {
          path: 'landlord',
          select: ['first_name', 'last_name', '_id', 'avatar']
        }
      ]
    });
  }

  // Get a single match by ID
  public async getMatchByQuery(query: IMatchQueryParams): Promise<MatchDocument | null> {
    return this.matchModel
      .findOne(query)
      .populate('tenant', ['_id', 'first_name', 'last_name', 'avatar', 'email'])
      .populate('property', SelectedPropertyFields)
      .lean();
  }

  // Update a match by ID
  public async updateMatch(id: string, data: Partial<MatchDocument>): Promise<MatchDocument | null> {
    return this.matchModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Delete a match by ID
  public async deleteMatch(id: string): Promise<MatchDocument | null> {
    return this.matchModel.findByIdAndDelete(id).exec();
  }
}
