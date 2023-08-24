import { PaginateModel } from 'mongoose';
import { IPagingOptions } from '../../middleware/paging';
import { AssetDocument } from '../Asset/asset.interface';
import { CriteriaDocument } from '../Criteria/criteria.interface';
import MatchSchema from '../Match/match.schema';
import { generateLinksForImages } from '../Asset/helpers';
import httpStatus from 'http-status';
import createError from 'http-errors';
import assetService from '../Asset/services/asset.service';
import { MatchDocument } from '../Match/match.interface';
import { Role } from '../User/user.interface';

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

      response.docs = response.docs
        .filter((property: any) => {
          const percentage = this.calculateSimilarity(criteria, property);
          property.percentage = percentage.toFixed(0);

          return percentage >= 20;
        })
        .sort((a: any, b: any) => b.percentage - a.percentage);

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

  public async getFilteredTenantsByUser(pagingOptions: IPagingOptions, userId: string, propertyId: string) {
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
              select: ['email', 'username', 'first_name', 'last_name', 'avatar', 'role']
            }
          ]
        }
      );

      matchesUsers.docs = matchesUsers.docs.filter(
        (item: any) => item.created_by && item.created_by.role === Role.Client
      );

      const myProperties: AssetDocument[] | null = await assetService.findPublishedPropertiesExample(userId);
      const matches: MatchDocument[] = await MatchSchema.find({ created_by: userId }).lean();

      const data: any[] = [];

      for (const property of myProperties) {
        const processedProperties = matchesUsers.docs.map((item: MatchDocWithCreatedBY) => {
          return this.makeSuggestionObject(item, matches, property);
        });

        data.push(...processedProperties);
      }

      matchesUsers.docs = data
        .filter((item: any) => item.property.percentage > 20)
        .sort((a: any, b: any) => b.property.percentage - a.property.percentage);
      return { response: matchesUsers, success: true };
    } catch (error: any) {
      console.log(error);
      return { response: error, success: false };
    }
  }

  private makeSuggestionObject = (
    item: MatchDocWithCreatedBY,
    matches: MatchDocument[],
    property: AssetDocument
  ) => {
    const matchTenant: MatchDocument | undefined = matches.find((match: any) => {
      return (
        match.tenant.toString() === item?.created_by?._id.toString() &&
        match.property.toString() === property._id.toString()
      );
    });

    const percentage = this.calculateSimilarity(item, property);
    const propertyWithPercentage = {
      ...property,
      percentage: parseInt(percentage.toFixed(0), 10)
    };

    return {
      criteria: item,
      property: propertyWithPercentage,
      chosen: matchTenant?.chosen ?? false,
      starred: matchTenant?.starred ?? false,
      matchId: matchTenant?._id ?? undefined
    };
  };

  public calculateSimilarity(clientCriteria: any, property: any): number {
    let matchingCriteria = 0;

    if (clientCriteria.area_of_interest === property.area_of_interest) matchingCriteria += 4;
    if (clientCriteria.credit_score_requirements === property.credit_score_requirements) matchingCriteria++;
    if (clientCriteria.room_details.number_of_bedrooms === property.room_details.number_of_bedrooms) {
      matchingCriteria++;
    }
    if (
      clientCriteria?.room_details.number_of_bathrooms?.toString() ===
      property?.room_details?.number_of_bathrooms?.toString()
    )
      matchingCriteria++;

    const floorSize: string[] = clientCriteria?.floor_size.split('-');

    if (
      property.floor_size >= parseInt(floorSize[0], 10) &&
      property.floor_size <= parseInt(floorSize[1], 10)
    ) {
      matchingCriteria++;
    }

    for (const propertyType of clientCriteria.property_type) {
      if (property.property_type === propertyType) {
        matchingCriteria++;
      }
    }

    const [minBudget, maxBudget] = clientCriteria.budget.split(' - ').map(Number);

    if (
      property.budget &&
      property.budget.min_budget >= minBudget &&
      property.budget.max_budget <= maxBudget
    ) {
      matchingCriteria++;
    }

    if (clientCriteria.specific_property_features.includes('Parking spot') && property.parking_spot > 0) {
      matchingCriteria++;
    }

    return (matchingCriteria / 10) * 100;
  }
}

interface MatchDocWithCreatedBY extends MatchDocument {
  created_by: any;
}
