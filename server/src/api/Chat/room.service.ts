import RoomModel from './schemas/room.schema';
import ChatModel from './schemas/message.schema';
import { RoomDocument } from './room.interface';
import { getPipelineBySort } from './pipelines/RoomAggregation';
import { Types } from 'mongoose';

const DefaultResponse: any = {
  docs: [],
  limit: 10,
  page: 1,
  totalDocs: 0,
  totalPages: 1
};

type PaginationOptions = {
  sort?: object;
  page?: number;
  limit?: number;
};

interface IResponse {
  docs: any[];
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
}

const getAll = async (
  query: any,
  pagingOptions: PaginationOptions | undefined,
  userId: Types.ObjectId
): Promise<IResponse> => {
  const { page, limit }: PaginationOptions = pagingOptions || {};
  const sort: any = { 'last_message.created_at': -1 };
  const skip = page ? (page - 1) * 10 : 0;

  const response = await RoomModel.aggregate([
    {
      $match: { ...query }
    },
    // @ts-ignore
    ...getPipelineBySort('getAll')(page, skip, limit, sort, userId)
  ]);

  return response.length > 0 ? response[0] : DefaultResponse;
};

const getMessages = async (
  query: any,
  pagingOptions: PaginationOptions | undefined,
  userId: Types.ObjectId
) => {
  const { page, limit }: PaginationOptions = pagingOptions || {};
  const sort: any = { created_at: -1 };
  const skip = page ? (page - 1) * 10 : 0;
  const response = await ChatModel.aggregate([
    {
      $match: { ...query }
    },
    // @ts-ignore
    ...getPipelineBySort('getRoomMessages')(page, skip, limit, sort, userId)
  ]);

  return response.length > 0 ? response[0] : DefaultResponse;
};

const getRoomDetails = async (query: any) => {
  return RoomModel.findOne({ ...query })
    .populate('author', ['first_name', 'last_name'])
    .populate('participant', ['first_name', 'last_name']);
};

const findOne = async (query: any) => {
  return RoomModel.findOne({ ...query }).populate('author', ['first_name', 'last_name']).populate('participant', ['first_name', 'last_name']);
};

const findWithAggregate = async (id: string) => {
  const userId = new Types.ObjectId(id);

  const response = await RoomModel.aggregate([
    {
      $match: { _id: userId }
    },
    // @ts-ignore
    ...getPipelineBySort('findOne')(userId)
  ]);

  return response.length > 0 ? response[0] : DefaultResponse;
};

const create = async (roomDocument: RoomDocument): Promise<RoomDocument> => {
  const room = new RoomModel({
    ...roomDocument
  });

  return await room.save();
};

const deleteRoom = async (id: string): Promise<any> => {
  return RoomModel.findByIdAndDelete(id);
};

export default {
  getAll,
  findOne,
  create,
  getRoomDetails,
  deleteRoom,
  findWithAggregate,
  getMessages
};
