import { PaginateModel } from 'mongoose';
import { IPagingOptions } from '../../middleware/paging';
import { PropertyDocument } from '../Property/property.interface';
import { CriteriaDocument } from '../Criteria/criteria.interface';
import MatchSchema from '../Match/match.schema';
import { generateLinksForImages } from '../Property/helpers';
import httpStatus from 'http-status';
import createError from 'http-errors';
import assetService from '../Property/services/property.service';
import { MatchDocument } from '../Match/match.interface';
import { Role } from '../User/user.interface';
import { includes } from 'lodash';
import { number } from 'joi';

export default class SuggestionService {
  private assetModel: PaginateModel<PropertyDocument>;
  private criteriaModel: PaginateModel<CriteriaDocument>;
  constructor(assetModel: PaginateModel<PropertyDocument>, criteriaModel: PaginateModel<CriteriaDocument>) {
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
              select: ['email', 'username', 'first_name', 'last_name', 'avatar', 'role', 'deleted_at'],
              match: { deleted_at: { $exists: false } }
            }
          ]
        }
      );

      matchesUsers.docs = matchesUsers.docs.filter(
        (item: any) => item.created_by && item.created_by.role === Role.Client
      );

      const myProperties: PropertyDocument[] | null = await assetService.findPublishedPropertiesExample(
        userId
      );

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

  public async getTenantsByUser(userId: string) {
    try {
      let matchesUsers: any[] = await this.criteriaModel
        .find({
          created_by: { $ne: userId }
        })
        .populate({
          path: 'created_by',
          select: ['email', 'username', 'first_name', 'last_name', 'avatar', 'role', 'deleted_at'],
          match: { deleted_at: { $exists: false } }
        });

      matchesUsers = matchesUsers.filter(
        (item: any) => item.created_by && item.created_by.role === Role.Client
      );

      const myProperties: PropertyDocument[] | null = await assetService.findPublishedPropertiesExample(
        userId
      );

      const matches: MatchDocument[] = await MatchSchema.find({ created_by: userId }).lean();

      const data: any[] = [];

      for (const property of myProperties) {
        const processedProperties = matchesUsers.map((item: any) => {
          return this.makeSuggestionObject(item, matches, property);
        });

        data.push(...processedProperties);
      }

      matchesUsers = data
        .filter((item: any) => item.property.percentage > 20)
        .sort((a: any, b: any) => b.property.percentage - a.property.percentage);
      return { response: matchesUsers, success: true };
    } catch (error: any) {
      return { response: error, success: false };
    }
  }

  private makeSuggestionObject = (
    item: MatchDocWithCreatedBY,
    matches: MatchDocument[],
    property: PropertyDocument
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

  public toCamelCase(inputString: string): string {
    return (
      inputString.split(' ').join('').charAt(0).toLocaleLowerCase() + inputString.slice(1).split(' ').join('')
    );
  }

  public calculateSimilarity(clientCriteria: any, property: any): number {
    let matchingCriteria = 0;

    if (clientCriteria.area_of_interest === property.area_of_interest) matchingCriteria += 4;
    if (clientCriteria.radius <= property.radius) matchingCriteria++;
    if (clientCriteria.property_type.includes(property.property_type)) matchingCriteria++;
    if (clientCriteria.property_preferences.includes(property.property_preference)) matchingCriteria++;
    if (clientCriteria.deposit_amount >= property.asset_rent.deposit_amount) matchingCriteria++;
    if (
      clientCriteria.contract_details.every((i: string) =>
        property.contract_details.includes(this.toCamelCase(i))
      )
    )
      matchingCriteria++;
    if (clientCriteria.credit_score_requirements === property.credit_score_requirements) matchingCriteria++;
    if (clientCriteria.room_details.number_of_bedrooms === property.room_details.number_of_bedrooms) {
      matchingCriteria++;
    }
    if (
      clientCriteria?.room_details.number_of_bathrooms?.toString() ===
      property?.room_details?.number_of_bathrooms?.toString()
    )
      matchingCriteria++;

    const floorSize: string[] = clientCriteria?.floor_size?.split('-') || [];

    if (
      floorSize.length > 0 &&
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

    if (clientCriteria.budgetFor === 'Week') {
      const weeksInMonth = 4.34524;
      const [clientMinBudget, clientMaxBudget] = [minBudget * weeksInMonth, maxBudget * weeksInMonth];
      console.log('aaaaaa: ', [clientMinBudget, clientMaxBudget]);
      if (
        property.budget &&
        property.budget.min_budget >= clientMinBudget &&
        property.budget.max_budget <= clientMaxBudget
      ) {
        matchingCriteria++;
      }
    }

    if (clientCriteria.budgetFor === 'Month') {
      if (
        property.budget &&
        property.budget.min_budget >= minBudget &&
        property.budget.max_budget <= maxBudget
      ) {
        matchingCriteria++;
      }
    }
    console.log('matchingCriteria: ', matchingCriteria);
    if (clientCriteria.specific_property_features.includes('Parking spot') && property.parking_spot > 0) {
      matchingCriteria++;
    }
    return (matchingCriteria / 16) * 100;
  }
}

interface MatchDocWithCreatedBY extends MatchDocument {
  created_by: any;
}
