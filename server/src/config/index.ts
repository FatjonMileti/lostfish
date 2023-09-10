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
  frontendUrl: process.env.FRONTEND_URL,
  googleKey: process.env.GOOGLE_MAP_KEY,
  useAzureStorage: process.env.USE_AZURE_BLOB_BACKET === 'true',
  lostfishApiToken: process.env.LOSTFISH_API_ACCESS_TOKEN,
  useRedis: ['stage', 'production'].includes(stage),
  azure: {
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    azureStorageName: process.env.AZURE_STORAGE_NAME
  },
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
  docusign: {
    dsJWTClientId: process.env.DS_JWT_CLIENT_ID ?? '',
    appAccountId: process.env.APP_ACCOUNT_ID ?? '',
    impersonatedUserGuid: process.env.IMPERSONATED_USER_GUID ?? '',
    dsOauthServer: process.env.DS_OAUTH_SERVER ?? '',
    rentingTemplateId: process.env.RENTING_TEMPLATE_ID ?? '',
    transactionAgreementTemplate: process.env.LOSTFISH_TRANSACTION_AGREEMENT_TEMPLATE_ID ?? '',
    privacyAgreementTemplate: process.env.LOSTFISH_PRIVACY_AGREEMENT_TEMPLATE_ID ?? '',
    basePath: process.env.DOCUSIGN_BASE_PATH ?? ''
  },
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  userEmail: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  logging: false
};

export default merge(defaultConfig, envConfig);
