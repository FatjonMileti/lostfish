import { Types } from 'mongoose';

type PaginationPipelineFunc = (
  page?: number,
  skip?: number,
  limit?: number,
  sort?: object,
  userId?: Types.ObjectId
) => any[];

type GetRoomPagingPipelineFunc = (
  page?: number,
  skip?: number,
  limit?: number,
  sort?: object,
  userId?: Types.ObjectId
) => any[];

type GetOnePipelineFunc = (userId: Types.ObjectId) => any[];

interface Pipelines {
  getAll: PaginationPipelineFunc;
  findOne: GetOnePipelineFunc;
  getRoomMessages: GetRoomPagingPipelineFunc;
}

export const getPipelineBySort = (type: keyof Pipelines = 'getAll'): Pipelines[keyof Pipelines] => {
  const pipelinesBySort: Pipelines = {
    getAll: PaginationPipeline,
    findOne: GetOnePipeline,
    getRoomMessages: ChatPagingPipeline
  };

  return pipelinesBySort[type];
};

const PaginationPipeline: PaginationPipelineFunc = (
  page = 1,
  skip = 0,
  limit = 10,
  sort = {},
  userId: Types.ObjectId | undefined
) => {
  return [
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'room_id',
        as: 'messages'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participant',
        foreignField: '_id',
        as: 'participant'
      }
    },
    {
      $unwind: {
        path: '$participant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        last_message: {
          $reduce: {
            input: '$messages',
            initialValue: null,
            in: {
              $cond: {
                if: { $gt: ['$$this.created_at', '$$value.created_at'] },
                then: '$$this',
                else: '$$value'
              }
            }
          }
        },
        unseen_messages: {
          $size: {
            $filter: {
              input: '$messages',
              as: 'message',
              cond: {
                $and: [{ $eq: ['$$message.seen', false] }, { $ne: ['$$message.sender', userId] }]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        last_message: 1,
        author: { first_name: 1, last_name: 1, _id: 1 },
        participant: { first_name: 1, last_name: 1, _id: 1 },
        unseen_messages: 1
      }
    },
    {
      $sort: {
        ...sort,
        created_at: -1
      }
    },
    {
      $group: {
        _id: null,
        docs: {
          $push: '$$ROOT'
        },
        totalDocs: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        docs: {
          $slice: ['$docs', skip, limit]
        },
        totalDocs: 1,
        limit: {
          $literal: limit
        },
        page: {
          $literal: page
        },
        totalPages: {
          $ceil: {
            $divide: ['$totalDocs', limit]
          }
        }
      }
    }
  ];
};

const ChatPagingPipeline: PaginationPipelineFunc = (
  page = 1,
  skip = 0,
  limit = 10,
  sort = {},
  userId: Types.ObjectId | undefined
) => {
  return [
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participant',
        foreignField: '_id',
        as: 'participant'
      }
    },
    {
      $unwind: {
        path: '$participant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender'
      }
    },
    {
      $unwind: {
        path: '$sender',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        author: { first_name: 1, last_name: 1, _id: 1 },
        participant: { first_name: 1, last_name: 1, _id: 1 },
        sender: { first_name: 1, last_name: 1, _id: 1 },
        message: 1,
        seen: 1,
        created_at: 1
      }
    },
    {
      $sort: {
        ...sort
      }
    },
    {
      $facet: {
        total: [
          {
            $count: 'created_at'
          }
        ],
        data: [
          {
            $addFields: {
              _id: '$_id'
            }
          }
        ]
      }
    },
    {
      $unwind: '$total'
    },
    {
      $project: {
        docs: {
          $slice: [
            '$data',
            skip,
            {
              $ifNull: [limit, '$total.created_at']
            }
          ]
        },

        totalDocs: '$total.created_at',
        limit: {
          $literal: limit
        },
        page: {
          $literal: page
        },
        totalPages: {
          $ceil: {
            $divide: ['$total.created_at', limit]
          }
        }
      }
    }
  ];
};

const GetOnePipeline: GetOnePipelineFunc = (userId: Types.ObjectId) => {
  return [
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'room_id',
        as: 'messages'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participant',
        foreignField: '_id',
        as: 'participant'
      }
    },
    {
      $unwind: {
        path: '$participant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        last_message: {
          $ifNull: [
            {
              $arrayElemAt: [
                '$messages',
                {
                  $indexOfArray: ['$messages', { $max: '$messages.created_at' }]
                }
              ]
            },
            null
          ]
        },
        unseen_messages: {
          $size: {
            $filter: {
              input: '$messages',
              as: 'message',
              cond: {
                $and: [{ $eq: ['$$message.seen', false] }, { $ne: ['$$message.sender', userId] }]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        last_message: 1,
        author: 1,
        participant: 1,
        unseen_messages: 1
      }
    }
  ];
};
