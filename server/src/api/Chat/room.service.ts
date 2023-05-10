import RoomModel from '../../data/room';
import { RoomDocument } from '../../data/interfaces/room.interface';
import { getPipelineBySort } from './pipelines/RoomAggregation';

import mongoose, { Document, ObjectId, Schema, Mongoose, Types } from 'mongoose';
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

const getAll = async (query: any, pagingOptions: PaginationOptions | undefined): Promise<IResponse> => {
  const { page, limit }: PaginationOptions = pagingOptions || {};
  const sort: any = { 'last_message.created_at': -1 };
  const skip = page ? (page - 1) * 10 : 0;
  const response = await RoomModel.aggregate([
    {
      $match: { ...query }
    },
    ...getPipelineBySort('name')(page, skip, limit, sort)
  ]);

  return response.length > 0 ? response[0] : DefaultResponse;
};

const getRoomDetails = async (query: any) => {
  return RoomModel.findOne({ ...query })
    .populate('author', ['first_name', 'last_name'])
    .populate('participant', ['first_name', 'last_name']);
};

const findOne = async (query: any) => {
  return RoomModel.findOne({ ...query });
};

const findWithAggregate = async (id: string) => {
  const response = await RoomModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) }
    },
    ...getPipelineBySort('findOne')()
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
  findWithAggregate
};
