import { seedUsers } from './user.seeder';
import chalk from 'chalk';

const init = () => {
  console.log(chalk.bold.green('Initiating seeders'));
  try {
    seedUsers(10).then(() => console.log(chalk.bold.green('User seeder: success')));
  } catch (error) {
    console.log(chalk.bold.red('failed to seed'));
  }
};

init();
