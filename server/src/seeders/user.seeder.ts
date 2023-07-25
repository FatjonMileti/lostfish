import { faker } from '@faker-js/faker';
import UserSchema from '../api/User/user.schema';
import { hashPassword } from '../api/User/user.helpers';
import { Role, UserDocument } from '../api/User/user.interface';
const password = 'Lostfish1234';

const remainingRoles = Object.values(Role);

const generateDefaultUsers = async () => {
  const hash = <string>await hashPassword(password);
  return remainingRoles.map<Partial<UserDocument>>((role) => {
    return {
      first_name: 'Lostfish',
      last_name: role,
      email: `${role}@lostfish.com`,
      role,
      phone: faker.phone.number(),
      is_disabled: false,
      avatar: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5']),
      hash
    };
  });
};

// Function to generate a random user
const generateRandomUser = async () => {
  const user: any = {
    role: faker.helpers.arrayElement(['Landlord', 'Tenant']),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    first_name: faker.internet.displayName(),
    last_name: faker.internet.displayName(),
    is_disabled: false,
    description: faker.lorem.sentences(),
    avatar: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5']),
    last_login: faker.date.recent(),
    address: faker.location.streetAddress(),
    edited_at: faker.date.recent()
  };

  user.hash = <string>await hashPassword(password);

  return user;
};

// Function to seed users
export const seedUsers = async (numUsers: number): Promise<void> => {
  try {
    await UserSchema.deleteMany({});

    const users = await Promise.all(Array.from({ length: numUsers }, generateRandomUser));
    const defaultUsers = await generateDefaultUsers();

    await UserSchema.insertMany([...defaultUsers, ...users]);

    console.log(`${numUsers} users seeded successfully.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
