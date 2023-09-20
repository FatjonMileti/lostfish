import PropertySchema from '../api/Property/schemas/property.schema';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import {
  ContractDetails,
  CountryCode,
  CreditScoreRequirement,
  CurrencyCode,
  FloorSizeUnit,
  PropertyDocument,
  PropertyFeatures,
  PropertyPreferences,
  PropertyType,
  RentalFrequency,
  SpecificPropertyFeatures,
  TransactionTypeString
} from '../api/Property/property.interface';
import userService from '../api/User/user.service';
import { AssetLog } from '../data/logs';
import propertyDetailService from '../api/Property/services/property-detail.service';
import PropertyDetailsSchema from '../api/Property/schemas/property-details.schema';
import config from '../config/index';
import PropertyViewSchema from '../api/Property/schemas/property-view.schema';
import { getPropertyScore } from '../api/Property/helpers';

// Function to search for images on Unsplash
const searchImages = async () => {
  const query: string = 'apartment';
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 100,
        client_id: config.imageGeneratorKey
      }
    });

    return response.data.results.map((item: any) => {
      return {
        key: item.urls.regular,
        link: item.urls.regular
      };
    });
  } catch (error: any) {
    console.error('Error fetching images:', error.message);
    return [];
  }
};
let imagesTest: any = [];

const getImages = async () => {
  const data = await searchImages();
  imagesTest = [...data];
};

const generateProperty = async (index: number) => {
  const landlord = await userService.findOne({ email: 'Landlord@lostfish.com' });

  await getImages();

  const asset: any = {
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph({ min: 1, max: 2 }),
    location_details: faker.lorem.text(),
    area_of_interest: faker.location.streetAddress(),
    radius: faker.helpers.arrayElement(['1', '5', '10', '50']),
    asset_address: {
      administrative_area_level_1: faker.location.country(),
      country_code: faker.helpers.arrayElement(Object.values(CountryCode)),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      text: faker.location.streetAddress()
    },
    budget: {
      min_budget: faker.number.int({ min: 100, max: 500 }),
      max_budget: faker.number.int({ min: 600, max: 5000 })
    },
    asset_rent: {
      deposit_amount: faker.number.int({ min: 100, max: 500 }),
      rental_amount: faker.number.int({ min: 500, max: 5000 }),
      rental_frequency: faker.helpers.arrayElement(Object.values(RentalFrequency))
    },
    parking_spot: faker.helpers.arrayElement([1, 2, 3, 4]),
    epc_rating: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
    currency_code: faker.helpers.arrayElement(Object.values(CurrencyCode)),
    floor_size: faker.number.int({ min: 20, max: 250 }),
    floor_size_unit: FloorSizeUnit.SQR_MTRS,
    master_asset_type_string: 'Residential',
    property_type: faker.helpers.arrayElement(Object.values(PropertyType)),
    property_features: faker.helpers.arrayElements(Object.values(PropertyFeatures)),
    specific_property_features: faker.helpers.arrayElements(Object.values(SpecificPropertyFeatures)),
    property_preference: faker.helpers.arrayElement(Object.values(PropertyPreferences)),
    credit_score_requirements: faker.helpers.arrayElement(Object.values(CreditScoreRequirement)),
    room_details: {
      number_of_bathrooms: faker.number.int({ min: 1, max: 3 }),
      number_of_bedrooms: faker.number.int({ min: 1, max: 5 })
    },
    status_string: faker.helpers.arrayElement(['Live', 'Draft']),
    transaction_type_string: TransactionTypeString.Rent,
    contract_details: faker.helpers.arrayElements(Object.values(ContractDetails)),
    property_images: faker.helpers.arrayElements(imagesTest, { min: 1, max: 6 })
  };

  asset.created_by = landlord?._id ?? undefined;

  return asset;
};

export const seedProperties = async (numAssets: number): Promise<void> => {
  try {
    await PropertySchema.deleteMany({});
    await PropertyDetailsSchema.deleteMany({});
    await PropertyViewSchema.deleteMany({});
    await AssetLog.deleteMany({});

    const propertyData: any[] = [];
    for (let i = 0; i < numAssets; i++) {
      const property = await generateProperty(i);
      propertyData.push(property);
    }
    // @ts-ignore
    const properties: PropertyDocument[] = await PropertySchema.insertMany(propertyData);
    for (const property of properties) {
      const propertyScore = getPropertyScore(property);
      await propertyDetailService.createPropertyDetail(property._id, propertyScore);
    }
    console.log(`${numAssets} properties seeded successfully.`);
  } catch (error) {
    console.error('Error seeding properties:', error);
  }
};
