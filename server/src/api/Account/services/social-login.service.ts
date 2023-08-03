import { Request, Response, CookieOptions } from 'express';
import UserModel from '../../User/user.schema';
import { Role, UserDocument } from '../../User/user.interface';
import { LoginLog, LoginLogAction } from '../../../data/logs';
import userService from '../../User/user.service';
import accountService from './account.service';
import axios from 'axios';
import { packRules } from '@casl/ability/extra';
import defineAbilitiesFor from '../../../casl/casl';
import httpStatus from 'http-status';
import createError from 'http-errors';
import config from '../../../config';
import * as process from 'process';

//========================================================================
interface TokenResponse {
  token_type: string;
  access_token: string;
  expires_in: string;
  refresh_token: string;
  refresh_expires_in: string;
  rules: any;
}

// add your client id and secret here:
const TWITTER_OAUTH_CLIENT_ID = process.env.TWITTER_AUTH_CLIENT_ID;
const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_AUTH_SECRET;

// the url where we get the twitter access token from
const TWITTER_OAUTH_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(
  `${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`,
  'utf8'
).toString('base64');

export const twitterOauthTokenParams = {
  client_id: TWITTER_OAUTH_CLIENT_ID ?? '',
  code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
  redirect_uri: config.twitter.redirect_url ?? '',
  grant_type: 'authorization_code'
};

// the shape of the object we should recieve from twitter in the request
type TwitterTokenResponse = {
  token_type: 'bearer';
  expires_in: 7200;
  access_token: string;
  scope: string;
};

// the main step 1 function, getting the access token from twitter using the code that twitter sent us
export async function getTwitterOAuthToken(code: string) {
  try {
    // POST request to the token url to get the access token
    const res = await axios.post<TwitterTokenResponse>(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${BasicAuthToken}`
        }
      }
    );

    return res.data;
  } catch (err) {
    return null;
  }
}
// the shape of the response we should get
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  email?: string;
}
// getting the twitter user from access token
export async function getTwitterUser(accessToken: string): Promise<TwitterUser | null> {
  try {
    const res = await axios.get<{ data: TwitterUser }>('https://api.twitter.com/2/users/me', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    return res.data.data ?? null;
  } catch (err) {
    return null;
  }
}
// cookie name
export const COOKIE_NAME = 'oauth2_token';

// cookie setting options
const cookieOptions: CookieOptions = {
  httpOnly: false,
  domain: process.env.DOMAIN,
  secure: process.env.NODE_ENV === 'stage',
  sameSite: 'strict'
};

async function addCookieToRes(res: Response, user: UserDocument) {
  const response: TokenResponse = await generateTokensForCurrentUser(user);
  res.cookie(COOKIE_NAME, JSON.stringify(response), {
    // adding the cookie to response here
    ...cookieOptions,
    expires: new Date(Date.now() + 7200 * 1000)
  });
}

const loginWithTwitter = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  const TwitterOAuthToken = await getTwitterOAuthToken(code as string);
  if (!TwitterOAuthToken) {
    return res.redirect(config.front_end_url + '/login');
  }

  const twitterUser = await getTwitterUser(TwitterOAuthToken.access_token);

  if (twitterUser) {
    const existingUser = await userService.findOne({
      'twitter.twitter_user_id': twitterUser.id,
      'twitter.is_twitter_verified': true
    });
    if (existingUser) {
      await addCookieToRes(res, existingUser);
      return res.redirect(config.front_end_url + '/twitter/redirect');
    } else {
      const newUser = await createUserFromTwitter(twitterUser);
      await addCookieToRes(res, newUser);
      return res.redirect(config.front_end_url + '/twitter/redirect');
    }
  } else {
    return res.redirect(config.front_end_url + '/login');
  }
};

const createUserFromTwitter = async (user: any): Promise<UserDocument> => {
  return await new UserModel({
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ')[1],
    twitter: {
      username: user.username,
      is_twitter_verified: true,
      twitter_user_id: user.id
    },
    is_disabled: false,
    hash: null,
    role: Role.Client
  }).save();
};

const createUserFromGoogle = async (user: any): Promise<UserDocument> => {
  return await new UserModel({
    email: user.email,
    first_name: user.given_name,
    last_name: user.family_name,
    google: {
      username: user.name,
      is_google_verified: true,
      google_user_id: user.sub
    },
    is_disabled: false,
    hash: null,
    role: Role.Client
  }).save();
};

const createUserFromFacebook = async (user: any): Promise<UserDocument> => {
  return await new UserModel({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    facebook: {
      username: user.name,
      is_facebook_verified: true,
      facebook_user_id: user.userID
    },
    is_disabled: false,
    hash: null,
    role: Role.Client
  }).save();
};

const generateTokensForCurrentUser = async (user: UserDocument): Promise<TokenResponse> => {
  const { token, refresh } = accountService.generateTokens(user);
  const rules = packRules(defineAbilitiesFor(user).rules);

  return {
    token_type: 'bearer',
    access_token: token,
    expires_in: process.env.JWT_EXPIRE_SECONDS || '',
    refresh_token: refresh,
    refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS || '',
    rules
  };
};

const loginThirdParties = async (req: Request, res: Response) => {
  const { provider, user } = req.body;

  try {
    const existingUser = await userService.findOne({
      email: user.email
    });

    if (!existingUser) {
      if (provider === 'google') {
        const newUser: UserDocument = await createUserFromGoogle(user);
        const response: TokenResponse = await generateTokensForCurrentUser(newUser);
        return res.status(httpStatus.OK).send(response);
      }

      if (provider === 'facebook') {
        const newUser: UserDocument = await createUserFromFacebook(user);
        const response: TokenResponse = await generateTokensForCurrentUser(newUser);
        return res.status(httpStatus.OK).send(response);
      }
    } else {
      if (existingUser && existingUser.is_disabled) {
        throw createError(httpStatus.UNAUTHORIZED, { message: 'user_is_disabled' });
      }

      await new LoginLog({
        user: existingUser._id,
        info: existingUser.first_name,
        action: LoginLogAction.Login
      }).save();

      const response: TokenResponse = await generateTokensForCurrentUser(existingUser);
      res.send(response);
    }
  } catch (error: any) {
    res.status(400).send(error);
  }
};

export default {
  loginWithTwitter,
  loginThirdParties
};
