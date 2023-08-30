import * as process from 'process';
require('dotenv').config();

export default {
  port: process.env.PORT || 3000,
  uses3Bucket: process.env.USE_S3_BACKET || false,
  behind_proxy: process.env.BEHIND_PROXY || 1,
  logging: true
};
