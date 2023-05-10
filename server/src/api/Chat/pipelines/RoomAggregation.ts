'use strict';
interface IPipeline {
  name: object;
  findOne: object;
}
// tslint:disable-next-line:no-any
export const getPipelineBySort = (sort = 'name'): any => {
  const pipelinesBySort: IPipeline = {
    name: PaginationPipeline,
    findOne: GetOnePipeline
  };

  // @ts-ignore
  return pipelinesBySort[sort];
};

const PaginationPipeline = (page = 1, skip = 0, limit = 10, sort = {}, afterLookapConditions: any) => {
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
        }
      }
    },
    {
      $project: {
        last_message: 1,
        author: 1,
        participant: 1
      }
    },
    {
      $match: {
        ...afterLookapConditions
      }
    },
    {
      $sort: {
        ...sort,
        created_at: -1
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

const GetOnePipeline = () => {
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
        }
      }
    },
    {
      $project: {
        last_message: 1,
        author: 1,
        participant: 1
      }
    }
  ];
};
