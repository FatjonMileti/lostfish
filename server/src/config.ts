import * as process from 'process';
require('dotenv').config();

export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: ['production', 'UAT'].includes(process.env.NODE_ENV as string),
  uses3Bucket: process.env.USE_S3_BACKET === 'true',
  mongo: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT,
    connection_string: `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
  },
  twitter: {
    redirect_url: process.env.TWITTER_REDIRECT_URL
  },
  api_url: process.env.ABSOLUTE_URL,
  lostfish_api_token: process.env.LOSTFISH_API_ACCESS_TOKEN,
  map_nearby_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  map_geocode_url: 'https://maps.googleapis.com/maps/api/geocode/json',
  google_key: process.env.GOOGLE_MAP_KEY,
  node_env: process.env.NODE_ENV ?? 'development',
  connection_string: process.env.DB_CONNECTION_STRING,
  offr_io_token: process.env.OFFR_IO_TOKEN,
  front_end_url: process.env.FRONTEND_URL ?? '',
  behind_proxy: process.env.BEHIND_PROXY,
  offr_io_api: 'https://demoapi.offr.io/v1',
  pm2InstanceNum: process.env.NODE_APP_INSTANCE ?? '0',
  email_user_account: process.env.EMAIL_USER,
  email_user_password: process.env.EMAIL_PASS,
  web: {
    client_id: '351618006281-cbuvkkhm5legionos66hh45r94tsuoo0.apps.googleusercontent.com',
    project_id: 'testiffproject',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    redirect_uris: ['http://localhost:4000/google/redirect'],
    javascript_origins: ['http://localhost:4000']
  },
  docusign: {
    dsJWTClientId: process.env.DS_JWT_CLIENT_ID ?? '',
    appAccountId: process.env.APP_ACCOUNT_ID ?? '',
    impersonatedUserGuid: process.env.IMPERSONATED_USER_GUID ?? '',
    integrationKey: process.env.INTEGRATION_KEY ?? '',
    privateKeyLocation: process.env.PRIVATE_KEY_LOCATION ?? '',
    dsOauthServer: process.env.DS_OAUTH_SERVER ?? '',
    templateId: process.env.TEMPLATE_ID ?? '',
    basePath: process.env.BASE_PATH ?? ''
  },
  aws: {
    region: process.env.AWS_REGION ?? '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    awsBucket: process.env.AWS_BACKET ?? ''
  }
};
