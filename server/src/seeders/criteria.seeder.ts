import { faker } from '@faker-js/faker';
import {
  CountryCode,
  CreditScoreRequirement,
  CurrencyCode,
  FloorSizeUnit,
  PropertyFeatures,
  PropertyPreferences,
  PropertyType,
  SpecificPropertyFeatures,
  TransactionTypeString
} from '../api/Property/property.interface';
import userService from '../api/User/user.service';
import { Role } from '../api/User/user.interface';
import CriteriaSchema from '../api/Criteria/schemas/criteria.schema';
import { MatchLog } from '../data/logs';

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

const createFakeDataMaxDetails = (user: any) => {
  return {
    area_of_interest: faker.location.streetAddress(),
    budget: faker.helpers.arrayElement(['1000 - 5000', '500 - 1500', '2000 - 10000']),
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
    looking_for: 'I’m looking for a place',
    floor_size: faker.helpers.arrayElement(['50-100', '70-120', '100-200']),
    floor_size_unit: FloorSizeUnit.SQR_MTRS,
    master_asset_type_string: 'Residential',
    property_preferences: faker.helpers.arrayElements([
      'New home',
      'Retirement home',
      'Shared ownership',
      'Auction'
    ]),
    property_type: faker.helpers.arrayElement(Object.values(PropertyType)),
    property_features: faker.helpers.arrayElements(Object.values(PropertyFeatures)),
    specific_property_features: faker.helpers.arrayElements(Object.values(SpecificPropertyFeatures)),
    property_preference: faker.helpers.arrayElement(Object.values(PropertyPreferences)),
    credit_score_requirements: faker.helpers.arrayElement(Object.values(CreditScoreRequirement)),
    room_details: {
      number_of_bathrooms: faker.helpers.arrayElement(['1-2', '1-3']),
      number_of_bedrooms: faker.helpers.arrayElement(['1-2', '1-5'])
    },
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
    const criterias = await Promise.all(Array.from({ length: numAssets }, generateCriteria));

    const defaultLandlordCriteria = await generateCriteriaLandlord();
    const defaultTenantUser = await generateCriteriaTenant();

    await CriteriaSchema.insertMany([defaultLandlordCriteria, defaultTenantUser, ...criterias]);
    console.log(`${numAssets} criteria seeded successfully.`);
  } catch (error) {
    console.error('Error seeding criteria:', error);
  }
};
