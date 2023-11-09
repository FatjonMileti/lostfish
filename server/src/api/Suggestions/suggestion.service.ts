import { PaginateModel } from 'mongoose';
import { IPagingOptions } from '../../middleware/paging';
import {
  BuildPurpose,
  DistanceUnit,
  FloorSizeUnit,
  Furniture,
  PropertyDocument,
  PropertyType,
  SpecificPropertyFeatures
} from '../Property/property.interface';
import { CriteriaDocument } from '../Criteria/criteria.interface';
import MatchSchema from '../Match/match.schema';
import { generateLinksForImages } from '../Property/helpers';
import httpStatus from 'http-status';
import createError from 'http-errors';
import assetService from '../Property/services/property.service';
import { MatchDocument } from '../Match/match.interface';
import { Role } from '../User/user.interface';

const toSquareMeters = (surface: number): number => {
  return surface * 0.092903;
};

export default class SuggestionService {
  private assetModel: PaginateModel<PropertyDocument>;
  private criteriaModel: PaginateModel<CriteriaDocument>;
  constructor(assetModel: PaginateModel<PropertyDocument>, criteriaModel: PaginateModel<CriteriaDocument>) {
    this.assetModel = assetModel;
    this.criteriaModel = criteriaModel;
  }

  public async getPropertiesWithoutAccount({
    criteria,
    pagingOptions,
    userId,
    chosen,
    disliked
  }: {
    criteria: CriteriaDocument;
    pagingOptions: IPagingOptions;
    userId: string;
    chosen: any;
    disliked: any;
  }): Promise<{ response: any; success: boolean }> {
    pagingOptions.limit = 100;
    // const criteria: CriteriaDocument | null = await this.criteriaModel.findOne({}).lean();

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

          if (property.percentage < 20) {
            return false;
          }

          return true;
        })
        .sort((a: any, b: any) => b.percentage - a.percentage);

      response.docs = generateLinksForImages(response.docs);

      response.docs = response.docs.map((item: any, index: number) => {
        return {
          sugestion_id: index,
          property: {
            ...item
          }
        };
      });

      return { response, success: true };
    } catch (error: any) {
      console.log(error);
      return { response: error, success: false };
    }
  }

  public async getFilteredPropertiesByUser(
    pagingOptions: IPagingOptions,
    userId: string,
    chosen: any,
    disliked: any
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

      const matches = await MatchSchema.find({ created_by: userId }).lean();

      response.docs = response.docs
        .filter((property: any) => {
          const percentage = this.calculateSimilarity(criteria, property);
          property.percentage = percentage.toFixed(0);

          const matchProperty = matches.find(
            (match: any) => match.property.toString() === property._id.toString()
          );

          if (property.percentage < 20) {
            return false;
          }

          if (chosen === 'false' && matchProperty?.chosen) {
            return false;
          }

          if (chosen === 'true' && matchProperty?.chosen) {
            return false;
          }

          if (disliked === 'false' && matchProperty?.disliked) {
            return false;
          }

          if (disliked === 'true' && !matchProperty?.disliked) {
            return false;
          }

          return true;
        })
        .sort((a: any, b: any) => b.percentage - a.percentage);

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
      console.log(error);
      return { response: error, success: false };
    }
  }

  public async getFilteredTenantsByUser({
    pagingOptions,
    userId,
    chosen,
    disliked,
    propertyId
  }: {
    pagingOptions: IPagingOptions;
    userId: string;
    chosen: any;
    disliked: any;
    propertyId?: any;
  }) {
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

      const myProperties: PropertyDocument[] | null = await assetService.findPublishedPropertiesExample({
        userId,
        propertyId
      });

      const matches: MatchDocument[] = await MatchSchema.find({ created_by: userId }).lean();

      const data: any[] = [];

      for (const property of myProperties) {
        const processedProperties = matchesUsers.docs.map((item: CriteriaDocument) => {
          return this.makeSuggestionObject(item, matches, property);
        });

        data.push(...processedProperties);
      }

      matchesUsers.docs = data
        .filter((item: any) => {
          if (item.property.percentage < 20) {
            return false;
          }

          if (chosen === 'false' && item.chosen) {
            return false;
          }

          if (chosen === 'true' && !item.chosen) {
            return false;
          }

          if (disliked === 'false' && item.disliked) {
            return false;
          }

          if (disliked === 'true' && !item.disliked) {
            return false;
          }

          return true;
        })
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

      const myProperties: PropertyDocument[] | null = await assetService.findPublishedPropertiesExample({
        userId
      });

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
    item: CriteriaDocument | any,
    matches: MatchDocument[],
    property: PropertyDocument
  ) => {
    const matchTenant: MatchDocument | undefined = matches.find((match: MatchDocument) => {
      return (
        match.tenant.toString() === item?.created_by?._id?.toString() &&
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
      disliked: matchTenant?.disliked ?? false,
      matchId: matchTenant?._id ?? undefined
    };
  };

  public toCamelCase(inputString: string): string {
    return (
      inputString.split(' ').join('').charAt(0).toLocaleLowerCase() + inputString.slice(1).split(' ').join('')
    );
  }

  public calculateSimilarity(clientCriteria: CriteriaDocument, property: PropertyDocument): number {
    let nrOfComparisons = 11;

    let matchingCriteria = 0;

    let matchLog: any = {};

    // Area of interest
    if (clientCriteria.area_of_interest === property.area_of_interest) {
      matchingCriteria += 5;
      matchLog['area_of_interest'] = true;
    }

    // Radius
    // if (clientCriteria.radius >= property.radius) matchingCriteria++;

    // property type
    if (clientCriteria.property_type.includes(property.property_type)) {
      matchingCriteria++;
      matchLog['property_type'] = true;
    }

    // Budget
    const minBudget = clientCriteria?.budget?.min;
    const maxBudget = clientCriteria?.budget?.max;

    if (clientCriteria.budget_for === 'Week') {
      const weeksInMonth = 4.34524;
      const [clientMinBudget, clientMaxBudget] = [minBudget * weeksInMonth, maxBudget * weeksInMonth];
      if (
        property.budget &&
        property.budget.min_budget >= clientMinBudget &&
        property.budget.max_budget <= clientMaxBudget
      ) {
        matchingCriteria++;
      }
    } else if (clientCriteria.budget_for === 'Month') {
      if (
        property.budget &&
        property.budget.min_budget >= minBudget &&
        property.budget.max_budget <= maxBudget
      ) {
        matchingCriteria++;

        matchLog['budget'] = true;
      }
    }

    // House

    if (property.property_type === PropertyType.House) {
      nrOfComparisons += 4;
      // Number of bedrooms
      if (
        clientCriteria.house_details.number_of_bedrooms &&
        property.room_details.number_of_bedrooms >= clientCriteria.house_details.number_of_bedrooms.min &&
        property.room_details.number_of_bedrooms <= clientCriteria.house_details.number_of_bedrooms.max
      ) {
        matchingCriteria++;
        matchLog['house_details.number_of_bedrooms'] = true;
      }

      // Number of bathrooms
      if (
        clientCriteria.house_details.number_of_bathrooms &&
        property.room_details.number_of_bathrooms >= clientCriteria.house_details.number_of_bathrooms.min &&
        property.room_details.number_of_bathrooms <= clientCriteria.house_details.number_of_bathrooms.max
      ) {
        matchingCriteria++;
        matchLog['house_details.number_of_bathrooms'] = true;
      }

      // Parking
      if (!!clientCriteria.house_details.parking && property.parking_spot > 0) {
        matchingCriteria++;
        if (property.parking_details && clientCriteria.house_details.parking === property.parking_details) {
          matchingCriteria++;
          matchLog['house_details.parking'] = true;
        }
      }

      // Preferred size
      {
        if (!!clientCriteria.house_details.preferred_size) {
          let houseSizeInSquareMeters;
          let criteriaHouseMinSizeInSquareMeters;
          let criteriaHouseMaxSizeInSquareMeters;

          if (property.floor_size_unit === FloorSizeUnit.SQR_MTRS) {
            houseSizeInSquareMeters = property.floor_size;
          } else {
            houseSizeInSquareMeters = toSquareMeters(clientCriteria.house_details.preferred_size.size.min);
          }

          if (clientCriteria.house_details.preferred_size.unit === FloorSizeUnit.SQR_MTRS) {
            criteriaHouseMinSizeInSquareMeters = clientCriteria.house_details.preferred_size.size.min;
            criteriaHouseMaxSizeInSquareMeters = clientCriteria.house_details.preferred_size.size.max;
          } else {
            criteriaHouseMinSizeInSquareMeters = toSquareMeters(
              clientCriteria.house_details.preferred_size.size.min
            );
            criteriaHouseMaxSizeInSquareMeters = toSquareMeters(
              clientCriteria.house_details.preferred_size.size.max
            );
          }

          if (
            houseSizeInSquareMeters >= criteriaHouseMinSizeInSquareMeters &&
            houseSizeInSquareMeters <= criteriaHouseMaxSizeInSquareMeters
          ) {
            matchingCriteria++;
            matchLog['house_details.preferred_size'] = true;
          }
        }
      }
    }

    // Flats
    if (property.property_type === PropertyType.Flats) {
      nrOfComparisons += 9;

      // Number of bedrooms
      if (
        property.room_details.number_of_bedrooms >= clientCriteria.flat_details.number_of_bedrooms?.min &&
        property.room_details.number_of_bedrooms <= clientCriteria.flat_details.number_of_bedrooms?.max
      ) {
        matchingCriteria++;

        matchLog['room_details.number_of_bedrooms'] = true;
      }

      // Number of bathrooms
      console.log(
        'property.room_details?.number_of_bathrooms:  ',
        property.room_details?.number_of_bathrooms
      );
      console.log(
        'clientCriteria.flat_details.number_of_bathrooms: ',
        clientCriteria.flat_details.number_of_bathrooms
      );
      if (
        property.room_details?.number_of_bathrooms >= clientCriteria.flat_details.number_of_bathrooms?.min &&
        property.room_details?.number_of_bathrooms <= clientCriteria.flat_details.number_of_bathrooms.min
      ) {
        matchingCriteria++;
        matchLog['room_details?.number_of_bathrooms'] = true;
      }

      // Preferred size
      {
        let propertySizeInSquareMeters;
        let criteriaMinSizeInSquareMeters;
        let criteriaMaxSizeInSquareMeters;

        if (property.floor_size_unit === FloorSizeUnit.SQR_MTRS) {
          propertySizeInSquareMeters = property.floor_size;
        } else {
          propertySizeInSquareMeters = toSquareMeters(clientCriteria.flat_details.preferred_size.size.min);
        }

        if (clientCriteria.flat_details.preferred_size.unit === FloorSizeUnit.SQR_MTRS) {
          criteriaMinSizeInSquareMeters = clientCriteria.flat_details.preferred_size.size.min;
          criteriaMaxSizeInSquareMeters = clientCriteria.flat_details.preferred_size.size.max;
        } else {
          criteriaMinSizeInSquareMeters = toSquareMeters(clientCriteria.flat_details.preferred_size.size.min);
          criteriaMaxSizeInSquareMeters = toSquareMeters(clientCriteria.flat_details.preferred_size.size.max);
        }

        if (
          propertySizeInSquareMeters >= criteriaMinSizeInSquareMeters &&
          propertySizeInSquareMeters <= criteriaMaxSizeInSquareMeters
        ) {
          matchingCriteria++;
          matchLog['flat_details.preferred_size'] = true;
        }
      }

      // Preferred floor
      if (clientCriteria.flat_details?.preferred_floor && property.flat_details?.floor) {
        if (clientCriteria.flat_details.preferred_floor === property.flat_details.floor) {
          matchingCriteria++;
          matchLog['flat_details?.preferred_floor'] = true;
        }
      }

      // Build purpose
      if (clientCriteria.flat_details?.property_purpose && property.flat_details?.property_purpose) {
        if (clientCriteria.flat_details.property_purpose === property.flat_details?.property_purpose) {
          matchingCriteria++;
          matchLog['flat_details?.property_purpose'] = true;
        }
      }

      if (property.flat_details?.property_purpose === BuildPurpose.PurposeBuilt) {
        // Lift
        if (typeof clientCriteria.flat_details?.lift === 'boolean') {
          if (clientCriteria.flat_details.lift === property.flat_details?.lift) {
            matchingCriteria++;
            matchLog['flat_details?.lift'] = true;
          }
        }

        // Security
        if (typeof clientCriteria.flat_details?.security === 'boolean') {
          if (clientCriteria.flat_details.security === property.flat_details?.security) {
            matchingCriteria++;
            matchLog['flat_details?.security'] = true;
          }
        }

        // Parking
        if (clientCriteria.flat_details.parking_space && property.parking_spot > 0) {
          matchingCriteria++;
          matchLog['flat_details.parking_space'] = true;
        }

        // Gym/spa
        if (clientCriteria.flat_details.gym_spa && property.flat_details) {
          matchingCriteria++;
          matchLog['flat_details.gym_spa'] = true;
        }
      }
    }

    // furniture
    if (
      (clientCriteria.specific_property_features.includes(Furniture.UNFURNISHED) &&
        property.specific_property_features.includes(Furniture.UNFURNISHED)) ||
      (clientCriteria.specific_property_features.includes(Furniture.PARTIALLY_FURNISHED) &&
        property.specific_property_features.includes(Furniture.PARTIALLY_FURNISHED)) ||
      (clientCriteria.specific_property_features.includes(Furniture.FULLY_FURNISHED) &&
        property.specific_property_features.includes(Furniture.FULLY_FURNISHED))
    ) {
      matchingCriteria++;

      matchLog['furniture'] = true;
    }

    // Distance from underground
    if (clientCriteria.distance_from_underground?.value && property.distance_from_underground?.value) {
      if (clientCriteria.distance_from_underground?.unit === DistanceUnit.mi) {
        if (
          property.distance_from_underground.value <=
          clientCriteria.distance_from_underground.value * 1.6
        ) {
          matchingCriteria++;
          matchLog['distance_from_underground'] = true;
        }
      } else {
        if (property.distance_from_underground.value <= clientCriteria.distance_from_underground.value) {
          matchingCriteria++;
          matchLog['distance_from_underground'] = true;
        }
      }
    }

    // Distance from school
    if (clientCriteria.distance_from_schools?.value && property.distance_from_schools?.value) {
      if (clientCriteria.distance_from_schools?.unit === DistanceUnit.mi) {
        if (property.distance_from_schools.value <= clientCriteria.distance_from_schools.value * 1.6) {
          matchingCriteria++;
          matchLog['distance_from_schools'] = true;
        }
      } else {
        if (property.distance_from_schools.value <= clientCriteria.distance_from_schools.value) {
          matchingCriteria++;
          matchLog['distance_from_schools'] = true;
        }
      }
    }

    // Distance from gym
    if (clientCriteria.distance_from_gym?.value && property.distance_from_gym?.value) {
      if (clientCriteria.distance_from_gym?.unit === DistanceUnit.mi) {
        if (property.distance_from_gym.value <= clientCriteria.distance_from_gym.value * 1.6) {
          matchingCriteria++;
          matchLog['distance_from_gym'] = true;
        }
      } else {
        if (property.distance_from_gym.value <= clientCriteria.distance_from_gym.value) {
          matchingCriteria++;
          matchLog['distance_from_gym'] = true;
        }
      }
    }

    // Distance from High street
    if (clientCriteria.distance_from_high_street?.value && property.distance_from_high_street?.value) {
      if (clientCriteria.distance_from_high_street?.unit === DistanceUnit.mi) {
        if (
          property.distance_from_high_street.value <=
          clientCriteria.distance_from_high_street.value * 1.6
        ) {
          matchingCriteria++;
          matchLog['distance_from_high_street'] = true;
        }
      } else {
        if (property.distance_from_high_street.value <= clientCriteria.distance_from_high_street.value) {
          matchingCriteria++;
          matchLog['distance_from_high_street'] = true;
        }
      }
    }

    console.log(
      'property: ',
      property.title,
      'matched: ',
      (matchingCriteria / nrOfComparisons) * 100,
      '%',
      ' ',
      matchingCriteria,
      ' of ',
      nrOfComparisons,
      'comparisons',
      matchLog
    );

    return (matchingCriteria / nrOfComparisons) * 100;
  }
}

interface MatchDocWithCreatedBY extends MatchDocument {
  created_by: any;
}
