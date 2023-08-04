import { seedUsers } from './user.seeder';
import { seedAssets } from './asset.seeder';
import { seedCriteria } from './criteria.seeder';
import chalk from 'chalk';
import mongoose from 'mongoose';
import config from '../config';
import { seedRoom } from './messageSeeder';
const dbConnect = require('../data');
dbConnect(config.connection_string);

const init = async () => {
  console.log(chalk.bold.green('Initiating seeders'));
  try {
    await seedUsers(10).then(() => console.log(chalk.bold.green('User seeder: success')));
    await seedAssets(10).then(() => console.log(chalk.bold.green('Asset seeder: success')));
    await seedCriteria(5);
    // await seedRoom();
  } catch (error) {
    console.log(chalk.bold.red('failed to seed'));
  } finally {
    await mongoose.disconnect();
  }
};

init();
