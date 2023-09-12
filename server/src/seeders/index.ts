import { seedUsers } from './user.seeder';
import { seedProperties } from './property.seeder';
import { seedCriteria } from './criteria.seeder';
import chalk from 'chalk';
import mongoose from 'mongoose';
import config from '../config/index';
import dbConnect from '../data';
dbConnect(config.connectionString);

const init = async () => {
  console.log(chalk.bold.green('Initiating seeders'));
  try {
    await seedUsers(10).then(() => console.log(chalk.bold.green('User seeder: success')));
    await seedProperties(10).then(() => console.log(chalk.bold.green('Property seeder: success')));
    await seedCriteria(5);
    // await seedRoom();
  } catch (error) {
    console.log(chalk.bold.red('failed to seed'));
  } finally {
    await mongoose.disconnect();
  }
};

init();
