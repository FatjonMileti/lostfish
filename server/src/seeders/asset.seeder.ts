import AssetSchema from '../api/Asset/schemas/asset.schema';
import { faker } from '@faker-js/faker';
import {
  ContractDetails,
  CountryCode,
  CurrencyCode,
  PropertyPreferences,
  PropertyType,
  RentalFrequency,
  TransactionTypeString
} from '../api/Asset/asset.interface';
import userService from '../api/User/user.service';

const generateAsset = async () => {
  const landlord = await userService.findOne({ email: 'Landlord@lostfish.com' });

  const imageUrl = faker.helpers.arrayElement([
    'https://image1.apartmentfinder.com/i2/QSPDNZRTt1ZwZHIYM6clPkkUn4EnHfS8ON7FSh_2Yuk/110/image.jpg',
    'https://image1.apartmentfinder.com/i2/hzP1c44UUaD1eD_wkA-WlKZK_4I2Sv6kewfU7JcScMY/116/the-irby-atlanta-ga-primary-photo.jpg',
    'https://image1.apartmentfinder.com/i2/DXJQ3WybRo8I_4dFOZcs8h9pwq1BdwPq2ohXMPXJiR0/116/the-irby-atlanta-ga-lobby.jpg',
    'https://image1.apartmentfinder.com/i2/XS85ZX4adC0GFvyeeU_qSUJl11pZ0rLA7keakzf1E4E/116/amli-lenox-atlanta-ga-2br-2ba---1248-sf.jpg',
    'https://image1.apartmentfinder.com/i2/H5pW-8KzWEeWGF2f2uI9EZaMmetOwKKdOvEGWiKTzvM/116/amli-lenox-atlanta-ga-2br-2ba---1248-sf.jpg'
  ]);
  const asset: any = {
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
    property_features: faker.helpers.arrayElement(['Parks Nearby']),
    specific_property_features: ['Parking spot', 'Partially furnished'],
    property_preference: faker.helpers.arrayElement(Object.values(PropertyPreferences)),
    room_details: {
      number_of_bathrooms: faker.number.int({ min: 1, max: 3 }),
      number_of_bedrooms: faker.number.int({ min: 1, max: 5 })
    },
    status_string: faker.helpers.arrayElement(['Live', 'Draft']),
    transaction_type_string: TransactionTypeString.Rent,
    contract_details: faker.helpers.arrayElements(Object.values(ContractDetails)),
    property_images: [
      {
        filename: imageUrl,
        key: imageUrl
      }
    ]
  };

  asset.created_by = landlord?._id ?? undefined;

  return asset;
};

export const seedAssets = async (numAssets: number): Promise<void> => {
  try {
    await AssetSchema.deleteMany({});

    const assets = await Promise.all(Array.from({ length: numAssets }, generateAsset));

    await AssetSchema.insertMany(assets);
    console.log(`${numAssets} assets seeded successfully.`);
  } catch (error) {
    console.error('Error seeding assets:', error);
  }
};
