export default {
  apiUrl: process.env.REACT_APP_BACK_END_URL as string,
  googleRedirectUrl: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  google: {
    google_app_id: process.env.REACT_APP_GG_APP_ID,
    redirect_page: process.env.REACT_APP_GOOGLE_REDIRECT_URI
  },
  facebook: {
    facebook_id: `${process.env.REACT_APP_FACEBOOK_APP_ID}`
  },
  redirect_uri: `${process.env.REACT_APP_FRONT_END_URL}`,
  twitter: {
    client_id: `${process.env.REACT_APP_TWITTER_APP_ID}`,
    redirect_page: process.env.REACT_APP_TWITTER_REDIRECT_PAGE
  },
  apple: {
    client_id: `${process.env.REACT_APP_APPLE_ID} || 'ttest'`
  }
};
