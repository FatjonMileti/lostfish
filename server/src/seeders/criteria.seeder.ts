import { faker } from '@faker-js/faker';
import {
  BuildPurpose,
  CountryCode,
  CreditScoreRequirement,
  CurrencyCode,
  Floor,
  FloorSizeUnit,
  House,
  PropertyFeatures,
  PropertyType,
  SpecificPropertyFeatures,
  TransactionTypeString
} from '../api/Property/property.interface';
import userService from '../api/User/user.service';
import { Role } from '../api/User/user.interface';
import CriteriaSchema from '../api/Criteria/schemas/criteria.schema';
import { MatchLog } from '../data/logs';
import { CriteriaDocument, LookingForEnum } from '../api/Criteria/criteria.interface';

const createFakeDataMinDetails = (user: any) => {
  return {
    area_of_interest: faker.location.streetAddress(),
    radius: faker.helpers.arrayElement(['1', '5', '10', '50']),
    currency_code: faker.helpers.arrayElement(Object.values(CurrencyCode)),
    looking_for: 'I own a place',
    floor_size_unit: FloorSizeUnit.SQR_MTRS,
    master_asset_type_string: 'Residential',
    property_preferences: [],
    property_features: [],
    specific_property_features: [],
    transaction_type_string: TransactionTypeString.Rent,
    created_by: user._id
  };
};

const createFakeDataMaxDetails = (user: any): Partial<CriteriaDocument> => {
  return {
    area_of_interest: faker.location.streetAddress(),
    budget: {
      min: faker.helpers.arrayElement([100, 200, 300, 400, 500]),
      max: faker.helpers.arrayElement([1000, 2000, 3000, 4000, 5000])
    },
    radius: faker.helpers.arrayElement(['1', '5', '10', '50']),
    asset_address: {
      administrative_area_level_1: faker.location.country(),
      country_code: faker.helpers.arrayElement(Object.values(CountryCode)),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      text: faker.location.streetAddress()
    },
    deposit_amount: faker.number.int({ min: 100, max: 500 }).toString(),
    currency_code: faker.helpers.arrayElement(Object.values(CurrencyCode)),
    moving_time: faker.helpers.arrayElement(['This month']),
    looking_for: LookingForEnum.LOOKING_FOR_PLACE,
    flat_details: {
      property_purpose: faker.helpers.arrayElement(Object.values(BuildPurpose)),
      preferred_floor: faker.helpers.arrayElement(Object.values(Floor)),

      preferred_size: {
        unit: FloorSizeUnit.SQR_FT,
        size: {
          min: 400,
          max: 4000
        }
      },
      number_of_bedrooms: {
        min: 1,
        max: 3
      },
      number_of_bathrooms: {
        min: 1,
        max: 4
      },
      outside_space: [],
      lift: faker.helpers.arrayElement([true, false]),
      security: faker.helpers.arrayElement([true, false]),
      parking_space: faker.helpers.arrayElement([true, false]),
      gym_spa: faker.helpers.arrayElement([true, false])
    },
    house_details: {
      house_type: [House.Detached, House.SemiDetached, House.FarmsLand],
      preferred_size: {
        unit: FloorSizeUnit.SQR_FT,
        size: {
          min: 200,
          max: 1000
        }
      },
      garden: {
        unit: FloorSizeUnit.SQR_FT,
        size: {
          min: 1000,
          max: 10000
        }
      },
      storeys: {
        min: 1,
        max: 3
      },
      number_of_bedrooms: {
        min: 1,
        max: 3
      },
      number_of_bathrooms: {
        min: 1,
        max: 4
      }
    },
    floor_size: faker.helpers.arrayElement(['50-100', '70-120', '100-200']),
    floor_size_unit: FloorSizeUnit.SQR_MTRS,
    property_preferences: faker.helpers.arrayElements([
      'New home',
      'Retirement home',
      'Shared ownership',
      'Auction'
    ]),
    property_type: [faker.helpers.arrayElement(Object.values(PropertyType))],
    property_features: faker.helpers.arrayElements(Object.values(PropertyFeatures)),
    specific_property_features: faker.helpers.arrayElements(Object.values(SpecificPropertyFeatures)),
    credit_score_requirements: faker.helpers.arrayElement(Object.values(CreditScoreRequirement)),
    transaction_type_string: TransactionTypeString.Rent,
    contract_details: faker.helpers.arrayElements(['Guarantor', 'Reviewed Property', 'Energy Certificate']),
    created_by: user._id
  };
};

const generateCriteriaLandlord = async () => {
  const defaultLandlordUser = await userService.findOne({ email: 'Landlord@lostfish.com' });

  if (defaultLandlordUser) {
    return createFakeDataMinDetails(defaultLandlordUser);
  }
};

const generateCriteriaTenant = async () => {
  const defaultTenantUser = await userService.findOne({ email: 'Tenant@lostfish.com' });
  if (defaultTenantUser) {
    return createFakeDataMaxDetails(defaultTenantUser);
  }
};

const generateCriteria = async () => {
  const tenants = await userService.findByQuery({ role: Role.Client, email: { $ne: 'Tenant@lostfish.com' } });

  const getUser = faker.helpers.arrayElement([...tenants]);

  if (getUser) {
    const criteria: any = createFakeDataMaxDetails(getUser);
    return criteria;
  }
};

export const seedCriteria = async (numAssets: number): Promise<void> => {
  try {
    await CriteriaSchema.deleteMany({});
    await MatchLog.deleteMany({});
    // const criterias = await Promise.all(Array.from({ length: numAssets }, generateCriteria));

    const defaultLandlordCriteria = await generateCriteriaLandlord();
    const defaultTenantUser = await generateCriteriaTenant();

    await CriteriaSchema.insertMany([
      defaultLandlordCriteria,
      defaultTenantUser
      // ...criterias
    ]);
    console.log(`${numAssets} criteria seeded successfully.`);
  } catch (error) {
    console.error('Error seeding criteria:', error);
  }
};
