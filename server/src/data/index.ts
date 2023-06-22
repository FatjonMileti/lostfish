import chalk from 'chalk';
import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';

module.exports = (connectionString: string, log: boolean = true) => {
  mongoose.connect(connectionString, {
    connectTimeoutMS: 30000,
    user: config.mongo.user,
    pass: config.mongo.password,
    dbName: config.mongo.database
  } as ConnectOptions);

  const db = mongoose.connection;

  if (log) {
    db.on('connected', () => {
      console.log(chalk.green('Mongoose connection is open'));
    });

    db.on('error', (err) => {
      console.error(chalk.red('Mongoose connection error:', err));
    });

    db.on('disconnected', () => {
      console.log(chalk.red('Mongoose connection is disconnected'));
    });
  }

  process.on('SIGINT', async () => {
    try {
      await db.close();
      console.log(chalk.red('Mongoose connection is disconnected due to application termination'));
      process.exit(0);
    } catch (err) {
      console.error(chalk.red('Error occurred while closing mongoose connection', err));
      process.exit(1);
    }
  });
};
