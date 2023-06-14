import moment from 'moment';
import mongoose, { mongo } from 'mongoose';
import config from '../config';
const dbConnect = require('../data');
dbConnect(config.connection_string);

import conditionService from '../api/Condition/services/condition.service';
import attributeService from '../api/Attribute/services/attribute.service';

const cronName: string = 'offerIo-data.synchronization';

const syncConditions = async () => {
  try {
    console.info(`starting conditions sync`);
    const response: mongo.BulkWriteResult | undefined = await conditionService.syncConditionsFromOfferIo();
    if (response) {
      console.info(`synced conditions successfully`);
    }
  } catch (error: any) {
    console.error(`conditions sync error: ${error.message}`);
  }
};

const syncAttributes = async () => {
  try {
    console.info(`starting attributes sync`);
    const response: mongo.BulkWriteResult | undefined = await attributeService.syncAttributesFromOfferIo();

    if (response) {
      console.info(`synced attributes successfully`);
    }
  } catch (error: any) {
    console.error(`attributes sync error: ${error.message}`);
  }
};

const tick = async () => {
  try {
    const timer = moment();
    console.log(`synchronization tick ${timer.toISOString()}`);

    await Promise.all([syncConditions(), syncAttributes()]);

    console.log(`synchronization tick took: ${moment().diff(timer, 'seconds')}s`);
  } catch (error: any) {
    console.error('Unknown error: ' + error.message);
  }

  await mongoose.connection.close();

  setTimeout(() => {
    process.exit(0);
  }, 1000 * 60 * 20);
};

console.log(`${cronName} started`);

tick();
