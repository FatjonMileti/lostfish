import { useGlobalState } from '../../globalState';
import React from 'react';
import axios from 'axios';
import config from '../../config';
import { buildAbilityFor } from '../../utils/ability.util';
import { unpackRules } from '@casl/ability/extra';
import { decodeJWT } from './Login';

export const SessionMaintainer = ({ debug = false }) => {
  const {
    user: [user, setUser]
  } = useGlobalState();

  const [refreshTimeoutId, setRefreshTimeoutId] = React.useState<NodeJS.Timeout | undefined>(undefined);

  const refreshToken = async () => {
    if (debug) console.log('Refreshing token...');

    try {
      const response = await axios.post(`${config.apiUrl}/api/account/refresh`, {
        refresh_token: user.auth.refresh_token
      });

      console.log('response.data', response.data);

      const userDetails = decodeJWT(response.data.access_token);
      userDetails.rules = response.data.rules;

      const ability = buildAbilityFor(userDetails!.role, unpackRules(response.data.rules));

      const auth = response.data;

      setUser((user: any) => ({
        ...user,
        auth: {
          ...auth,
          expirationTime: Date.now() + auth.expires_in * 1000,
          refreshExpirationTime: Date.now() + auth.refresh_expires_in * 1000
        },
        userDetails,
        ability
      }));
    } catch (error) {
      if (debug) console.log('Error refreshing token', error);
      setUser((user: any) => ({ ...user, auth: null, userDetails: null, ability: null }));
    }
  };

  React.useEffect(() => {
    if (user.auth) {
      const tokenExpirationTime = user.auth.expirationTime;
      const now = Date.now();
      const refreshTokenExpirationTime = user.auth.refreshExpirationTime;
      const timeUntilRefresh = tokenExpirationTime - now - 5 * 1000; // 1 minute before expiration

      if (debug) console.log({ tokenExpirationTime, now, timeUntilRefresh });

      if (timeUntilRefresh <= 0) {
        if (debug) console.log('Token has expired');
        if (now > refreshTokenExpirationTime) {
          if (debug) console.log('Refresh token has expired');
          setUser((user: any) => ({ ...user, auth: null, userDetails: null, ability: null }));
        } else {
          if (debug) console.log('Refresh token has not expired yet');
          refreshToken();
        }
      } else {
        if (debug) console.log('Token has not expired yet');
        const timeoutId = setTimeout(refreshToken, timeUntilRefresh);
        setRefreshTimeoutId(timeoutId);
      }
    } else {
      clearTimeout(refreshTimeoutId);
      setRefreshTimeoutId(undefined);
    }
  }, [user.auth]);

  return null;
};
