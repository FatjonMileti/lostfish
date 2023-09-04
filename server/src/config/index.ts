import merge from 'lodash.merge';
import * as process from 'process';
require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

type EnvironmentType = 'development' | 'stage' | 'production';

const stage: EnvironmentType = <EnvironmentType>process.env.NODE_ENV || 'development';

let envConfig;

if (stage === 'production') {
  envConfig = require('./prod').default;
} else if (stage === 'stage') {
  envConfig = require('./stage').default;
} else {
  envConfig = require('./local').default;
}

const defaultConfig = {
  stage,
  apiUrl: process.env.ABSOLUTE_URL,
  googleKey: process.env.GOOGLE_MAP_KEY,
  pm2InstanceNum: process.env.NODE_APP_INSTANCE || '0',
  twitter: {
    redirect_url: `${process.env.ABSOLUTE_URL}/api/account/login-twitter-callback`,
    clientId: process.env.TWITTER_AUTH_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_AUTH_SECRET || '',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
  },
  aws: {
    region: 'test',
    accessKeyId: 'test',
    secretAccessKey: 'test',
    awsBucket: 'test'
  },
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  userEmail: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  logging: false
};

export default merge(defaultConfig, envConfig);
