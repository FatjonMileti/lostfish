import { Request, Response } from 'express';
import UserModel from '../../User/user.schema';
import { Role } from '../../User/user.interface';
import { LoginLog, LoginLogAction } from '../../../data/logs';
import userService from '../../User/user.service';
import accountService from './account.service';
import axios from 'axios';
import { Client, auth } from 'twitter-api-sdk';
import { packRules } from '@casl/ability/extra';
import defineAbilitiesFor from '../../../casl/casl';
import httpStatus from 'http-status';
import createError from 'http-errors';
const { OAuth2Client } = require('google-auth-library');

// Google
const clientId = `${process.env.GOOGLE_CLIENT_ID}`;
const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`;
const redirectUri = `${process.env.GOOGLE_CLIENT_REDIRECT_URI}`;
const client = new OAuth2Client(clientId, clientSecret, redirectUri);

//Twitter
const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_AUTH_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_AUTH_SECRET as string,
  callback: process.env.TWITTER_REDIRECT_URL as string,
  scopes: ['tweet.read', 'users.read']
});

const STATE = 'my-state';
const clientTwitter = new Client(authClient);

const loginGoogle = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    // Verify and decode the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(404).send({ message: 'user_not_found' });
    }

    let user = await userService.findOne({
      email: payload.email
    });

    if (user && user.is_disabled) {
      throw createError(httpStatus.UNAUTHORIZED, { message: 'user_is_disabled' });
    }

    if (user && !user.google.is_google_verified) {
      user.google.is_google_verified = payload.email_verified;
      user.google.google_user_id = payload.sub;
      await user.save();
    }

    if (!user) {
      user = await new UserModel({
        email: payload.email,
        first_name: payload.given_name,
        last_name: payload.family_name,
        google: {
          is_google_verified: true,
          google_user_id: payload.sub || '',
          username: payload.given_name || ''
        },
        is_disabled: false,
        role: Role.Client
      }).save();

      if (!user) {
        return res.status(400).send({ message: 'user_can_not_created' });
      }
    }

    const { token, refresh } = accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.first_name,
      action: LoginLogAction.Login
    }).save();

    const rules = packRules(defineAbilitiesFor(user.role).rules);

    return res.json({
      token_type: 'bearer',
      access_token: token,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
      rules
    });
  } catch (error: any) {
    return res.status(error.code || httpStatus.BAD_REQUEST).send(error);
  }
};

const loginFacebook = async (req: Request, res: Response) => {
  const fbToken = req.body.token;

  const url = `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=${fbToken}`;

  try {
    const response = await axios.get(url);
    const userDetails: any = response.data;

    let user = await userService.findOne({
      email: userDetails.email
    });

    if (user && user.is_disabled) {
      throw createError(httpStatus.UNAUTHORIZED, { message: 'user_is_disabled' });
    }

    if (user && !user.facebook.is_facebook_verified) {
      user.facebook.is_facebook_verified = true;
      user.facebook.facebook_user_id = userDetails.id;
      await user.save();
    }

    if (!user) {
      const name = userDetails.name.split(' ');
      user = await new UserModel({
        email: userDetails.email,
        first_name: userDetails.first_name || name[0],
        last_name: userDetails.last_name || name[1],
        facebook: {
          username: userDetails?.first_name || name[0],
          is_facebook_verified: true,
          facebook_user_id: userDetails.id
        },
        is_disabled: false,
        hash: null,
        role: Role.Client
      }).save();

      if (!user) {
        return res.status(400).send({ message: 'user_can_not_created' });
      }
    }

    const { token, refresh } = accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.first_name,
      action: LoginLogAction.Login
    }).save();

    const rules = packRules(defineAbilitiesFor(user.role).rules);

    return res.json({
      token_type: 'bearer',
      access_token: token,
      expires_in: process.env.JWT_EXPIRE_SECONDS,
      refresh_token: refresh,
      refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS,
      rules
    });
  } catch (error: any) {
    res.status(400).send(error);
  }
};

const loginWithTwitter = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(400).send({ message: 'State isnt matching' });
    const response = await authClient.requestAccessToken(code as string);

    // @ts-ignore
    const { data } = await clientTwitter.users.findMyUser();
    if (!data) {
      return res.status(400).send({ message: 'cant find_user' });
    }
    let user = await userService.findOne({
      'twitter.username': data.username,
      'twitter.twitter_user_id': data.id,
      is_disabled: false
    });

    if (!user) {
      const name = data.name.split(' ');
      user = await new UserModel({
        first_name: name[0],
        last_name: name[1],
        twitter: {
          username: data?.username || '',
          is_twitter_verified: true,
          twitter_user_id: data.id
        },
        is_disabled: false,
        hash: null,
        role: Role.Client
      }).save();

      if (!user) {
        return res.status(400).send({ message: 'user_can_not_created' });
      }
    }
    const { token, refresh } = accountService.generateTokens(user);

    await new LoginLog({
      user: user._id,
      info: user.first_name,
      action: LoginLogAction.Login
    }).save();

    // return res.json({
    //   token_type: 'bearer',
    //   access_token: token,
    //   expires_in: process.env.JWT_EXPIRE_SECONDS,
    //   refresh_token: refresh,
    //   refresh_expires_in: process.env.REFRESH_EXPIRE_SECONDS
    // });
    res.redirect('http://localhost:4000/login?validated=true&access_token=' + token);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const generateTwitterUrl = async (req: Request, res: Response) => {
  try {
    const authUrl = authClient.generateAuthURL({
      state: STATE,
      code_challenge: 'challenge',
      code_challenge_method: 'plain'
    });

    return res.send({ authUrl });
  } catch (error: any) {
    res.status(400).send({ message: 'url_not_generated' });
  }
};

export default {
  loginGoogle,
  loginFacebook,
  loginWithTwitter,
  generateTwitterUrl
};
