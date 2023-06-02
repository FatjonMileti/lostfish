import * as process from 'process';
require('dotenv').config();

export default {
  api_url: process.env.ABSOLUTE_URL,
  map_nearby_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  map_geocode_url: 'https://maps.googleapis.com/maps/api/geocode/json',
  google_key: process.env.GOOGLE_MAP_KEY,
  node_env: process.env.NODE_ENV,
  connection_string: process.env.DB_CONNECTION_STRING,
  offr_io_token: process.env.TOKEN,
  front_end_url: process.env.FRONTEND_URL,
  behind_proxy: process.env.BEHIND_PROXY,
  offr_io_api: 'https://demoapi.offr.io/v1',
  web: {
    client_id: '816422965461-nk8j13vj4slj382u6q8dpttj8scpk6uo.apps.googleusercontent.com',
    project_id: 'calm-buttress-276608',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    redirect_uris: ['http://localhost:4000/google/redirect'],
    javascript_origins: ['http://localhost:4000']
  }
};
