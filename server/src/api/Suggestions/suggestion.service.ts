import { PaginateModel } from 'mongoose';
import { IPagingOptions } from '../../middleware/paging';
import { AssetDocument } from '../Asset/asset.interface';
import { CriteriaDocument } from '../Criteria/criteria.interface';
import MatchSchema from '../Match/match.schema';
import { generateLinksForImages } from '../Asset/helpers';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import createError from 'http-errors';
import assetService from '../Asset/services/asset.service';

export default class SuggestionService {
  private assetModel: PaginateModel<AssetDocument>;
  private criteriaModel: PaginateModel<CriteriaDocument>;
  constructor(assetModel: PaginateModel<AssetDocument>, criteriaModel: PaginateModel<CriteriaDocument>) {
    this.assetModel = assetModel;
    this.criteriaModel = criteriaModel;
  }

  public async getFilteredPropertiesByUser(
    pagingOptions: IPagingOptions,
    userId: string
  ): Promise<{ response: any; success: boolean }> {
    pagingOptions.limit = 100;
    const criteria: CriteriaDocument | null = await this.criteriaModel.findOne({ created_by: userId }).lean();

    if (!criteria) {
      throw createError(httpStatus.NOT_FOUND, { message: 'criteria_not_found' });
    }

    const query: any = {
      status_string: { $in: ['Let', 'Live', 'For Let', 'For Sale'] },
      deleted_at: { $exists: false }
    };

    try {
      const response: any = await this.assetModel.paginate(query, {
        ...pagingOptions,
        populate: [
          {
            path: 'created_by',
            select: ['email', 'username', 'first_name', 'last_name', 'avatar', 'deleted_at']
          },
          {
            path: 'edited_by',
            select: ['email', 'username', 'first_name', 'last_name', 'avatar']
          }
        ]
      });

      response.docs = response.docs.filter((property: any) => {
        const percentage = this.calculateSimilarity(criteria, property);
        property.percentage = percentage;

        return percentage >= 30;
      });

      const matches = await MatchSchema.find({ created_by: userId }).lean();
      response.docs = generateLinksForImages(response.docs);
      response.docs = response.docs.map((item: any, index: number) => {
        const matchProperty = matches.find((match: any) => match.property.toString() === item._id.toString());
        return {
          sugestion_id: index,
          property: {
            ...item
          },
          chosen: matchProperty?.chosen ?? false,
          starred: matchProperty?.starred ?? false,
          matchId: matchProperty?._id ?? undefined
        };
      });

      return { response, success: true };
    } catch (error: any) {
      return { response: error, success: false };
    }
  }

  public async getFilteredTenantsByUser(pagingOptions: IPagingOptions, userId: string) {
    try {
      const matchesUsers: any = await this.criteriaModel.paginate(
        {
          created_by: { $ne: userId }
        },
        {
          ...pagingOptions,
          populate: [
            {
              path: 'created_by',
              select: ['email', 'username', 'first_name', 'last_name', 'avatar']
            }
          ]
        }
      );

      const response = await assetService.findPublishedPropertiesExample();

      const matches = await MatchSchema.find({ created_by: userId }).lean();

      matchesUsers.docs = matchesUsers.docs.map((item: any, index: number) => {
        const criteria = item;
        const matchTenant = matches.find(
          (match: any) => match.tenant.toString() === criteria?.created_by?._id.toString()
        );
        return {
          suggestion_id: index,
          criteria,
          property: faker.helpers.arrayElement(response),
          chosen: matchTenant?.chosen ?? false,
          starred: matchTenant?.starred ?? false,
          matchId: matchTenant?._id ?? undefined,
          percentage: faker.number.int({ min: 30, max: 100 })
        };
      });
      return { response: matchesUsers, success: true };
    } catch (error: any) {
      console.log(error);
      return { response: error, success: false };
    }
  }

  private calculateSimilarity(clientCriteria: any, property: any): number {
    let matchingCriteria = 0;

    if (clientCriteria.room_details.number_of_bathrooms === property.room_details.number_of_bathrooms) {
      matchingCriteria++;
    }

    if (clientCriteria.room_details.number_of_bedrooms === property.room_details.number_of_bedrooms) {
      matchingCriteria++;
    }

    for (const preference of clientCriteria.property_preferences) {
      if (property.property_preference === preference) {
        matchingCriteria++;
      }
    }

    for (const feature of clientCriteria.property_features) {
      if (property.property_features.includes(feature)) {
        matchingCriteria++;
      }
    }

    for (const specificFeature of clientCriteria.specific_property_features) {
      if (property.specific_property_features.includes(specificFeature)) {
        matchingCriteria++;
      }
    }

    const totalCriteria =
      2 +
      clientCriteria.property_preferences.length +
      clientCriteria.property_features.length +
      clientCriteria.specific_property_features.length;

    return (matchingCriteria / totalCriteria) * 100;
  }
}
