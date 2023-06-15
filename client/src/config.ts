export default {
  apiUrl: process.env.REACT_APP_BACK_END_URL,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  googleRedirectUrl: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  googleAuthUri: process.env.REACT_APP_GOOGLE_AUTH_URI,
  googleAuthFullUrl:
    `${process.env.REACT_APP_GOOGLE_AUTH_URI}?` +
    `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`,
  facebook: {
    facebook_id: `${process.env.REACT_APP_FACEBOOK_APP_ID}`
  }
};
