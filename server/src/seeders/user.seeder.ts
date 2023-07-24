import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import UserSchema from '../api/User/user.schema';
import config from '../config';
import { hashPassword } from '../api/User/user.helpers';
import { Role, UserDocument } from '../api/User/user.interface';
import chalk from 'chalk';
const dbConnect = require('../data');
dbConnect(config.connection_string);
const password = 'Lostfish1234';

const generateAdminUser = async () => {
  const hash = <string>await hashPassword(password);
  const ADMIN_USER_SEEDER = <Partial<UserDocument>>{
    _id: '507f1f77bcf86cd799439011',
    first_name: 'Lostfish',
    last_name: 'Admin',
    email: 'admin@lostfish.com',
    role: Role.Admin,
    is_disabled: false,
    hash
  };
  return ADMIN_USER_SEEDER;
};

const remainingRoles = Object.values(Role).filter((e) => e !== Role.Admin);

const generateDefaultUsers = async () => {
  const hash = <string>await hashPassword(password);
  return remainingRoles.map<Partial<UserDocument>>((role) => {
    return {
      first_name: 'Lostfish',
      last_name: role,
      email: `${role}@lostfish.com`,
      role,
      is_disabled: false,
      hash
    };
  });
};

// Function to generate a random user
const generateRandomUser = async () => {
  const user: any = {
    role: faker.helpers.arrayElement(['Landlord', 'Tenant']),
    email: faker.internet.email(),
    phone: faker.number.int(10),
    first_name: faker.internet.displayName(),
    last_name: faker.internet.displayName(),
    is_disabled: false,
    description: faker.lorem.sentences(),
    avatar: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5']),
    last_login: faker.date.recent(),
    address: faker.lorem.text(),
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
    const adminUser = await generateAdminUser();

    await UserSchema.insertMany([adminUser, ...defaultUsers, ...users]);

    console.log(`${numUsers} users seeded successfully.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
  }
};
