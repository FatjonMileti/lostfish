import AssetSchema from '../api/Asset/schemas/asset.schema';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import {
  ContractDetails,
  CountryCode,
  CreditScoreRequirement,
  CurrencyCode,
  PropertyFeatures,
  PropertyPreferences,
  PropertyType,
  RentalFrequency,
  SpecificPropertyFeatures,
  TransactionTypeString
} from '../api/Asset/asset.interface';
import userService from '../api/User/user.service';
import { AssetLog } from '../data/logs';

// Define your Unsplash API key here
const ACCESS_KEY: string = 'jCUSC7UiB67_YlXdPgqHafZjswTiTwvO9aHtA0kWsng';

// Function to search for images on Unsplash
const searchImages = async () => {
  const query: string = 'apartment';
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 100,
        client_id: ACCESS_KEY
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

const generateAsset = async (index: number) => {
  const landlord = await userService.findOne({ email: 'Landlord@lostfish.com' });

  await getImages();

  const asset: any = {
    title: faker.lorem.sentence(),
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
    asset_rent: {
      deposit_amount: faker.number.int({ min: 100, max: 500 }),
      rental_amount: faker.number.int({ min: 500, max: 5000 }),
      rental_frequency: faker.helpers.arrayElement(Object.values(RentalFrequency))
    },
    currency_code: faker.helpers.arrayElement(Object.values(CurrencyCode)),
    floor_size_unit: 'Meter Squared',
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

export const seedAssets = async (numAssets: number): Promise<void> => {
  try {
    await AssetSchema.deleteMany({});
    await AssetLog.deleteMany({});

    const assets: any[] = []; //= await Promise.all(Array.from({ length: numAssets }, generateAsset));
    for (let i = 0; i < numAssets; i++) {
      const asset = await generateAsset(i);
      assets.push(asset);
    }
    await AssetSchema.insertMany(assets);
    console.log(`${numAssets} assets seeded successfully.`);
  } catch (error) {
    console.error('Error seeding assets:', error);
  }
};
