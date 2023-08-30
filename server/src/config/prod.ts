import * as process from 'process';
require('dotenv').config();

export default {
  port: process.env.PORT || 3000,
  uses3Bucket: process.env.USE_S3_BACKET || true,
  behind_proxy: process.env.BEHIND_PROXY || 1,
  mongo: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT
  },
  connectionString: `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  aws: {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsBucket: process.env.AWS_BUCKET || ''
  },
  logging: true
};
