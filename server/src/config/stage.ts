import * as process from 'process';
require('dotenv').config();

export default {
  port: process.env.PORT || 3000,
  uses3Bucket: process.env.USE_S3_BACKET === 'true' || false,
  behind_proxy: process.env.BEHIND_PROXY || 1,
  mongo: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT
  },
  connectionString: `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  imageGeneratorKey: process.env.IMAGE_GENERATOR_KEY,
  imageGeneratorSecret: process.env.IMAGE_GENERATOR_SECRET,
  logging: true
};
