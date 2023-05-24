export default {
  api_url: 'http://localhost:3000',
  map_nearby_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  google_key: process.env.GOOGLE_MAP_KEY,
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
