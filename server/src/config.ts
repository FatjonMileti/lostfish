import * as process from 'process';
require('dotenv').config();

export default {
  mongo: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT,
    connection_string: `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
  },
  api_url: process.env.ABSOLUTE_URL,
  map_nearby_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  map_geocode_url: 'https://maps.googleapis.com/maps/api/geocode/json',
  google_key: process.env.GOOGLE_MAP_KEY,
  node_env: process.env.NODE_ENV,
  connection_string: process.env.DB_CONNECTION_STRING,
  offr_io_token: process.env.OFFR_IO_TOKEN,
  front_end_url: process.env.FRONTEND_URL,
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
  }
};
