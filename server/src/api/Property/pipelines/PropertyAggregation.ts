import { Types } from 'mongoose';

type PaginationPipelineFunc = (
  page?: number,
  skip?: number,
  limit?: number,
  sort?: object,
  userId?: Types.ObjectId
) => any[];

interface Pipelines {
  getAll: PaginationPipelineFunc;
}

export const getPipelineBySort = (type: keyof Pipelines = 'getAll'): Pipelines[keyof Pipelines] => {
  const pipelinesBySort: Pipelines = {
    getAll: PaginationPipeline
  };

  return pipelinesBySort[type];
};

const PaginationPipeline: PaginationPipelineFunc = (page = 1, skip = 0, limit = 10, sort = {}) => {
  return [
    {
      $lookup: {
        from: 'users',
        let: { createdBy: '$created_by' }, // Define a variable for the user's _id
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$createdBy'] } // Use the $expr operator to match _id
            }
          },
          {
            $lookup: {
              from: 'criterias',
              localField: '_id',
              foreignField: 'created_by',
              as: 'criteria'
            }
          },
          {
            $unwind: {
              path: '$criteria',
              preserveNullAndEmptyArrays: true
            }
          }
        ],
        as: 'user'
      }
    },

    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'properties',
        localField: 'property',
        foreignField: '_id',
        as: 'property'
      }
    },
    {
      $unwind: {
        path: '$property',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        user: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          avatar: 1,
          criteria: 1
        },
        property: 1
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
