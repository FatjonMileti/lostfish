import { useGlobalState } from '../../globalState';
import React from 'react';
import axios from 'axios';
import config from '../../config';
import { buildAbilityFor } from '../../utils/ability.util';
import { unpackRules } from '@casl/ability/extra';
import { decodeJWT } from './Login';
import { Backdrop } from '../../components/Backdrop';

export const SessionMaintainer = ({
  debug = false,
  children = null
}: {
  debug?: boolean;
  children?: React.ReactNode;
}) => {
  const {
    user: [user, setUser]
  } = useGlobalState();

  const [refreshTimeoutId, setRefreshTimeoutId] = React.useState<NodeJS.Timeout | undefined>(undefined);
  const [resumingSession, setResumingSession] = React.useState<boolean>(true);

  const refreshToken = async () => {
    if (debug) console.log('Refreshing token...');

    try {
      const response = await axios.post(`${config.apiUrl}/api/account/refresh`, {
        refresh_token: user.auth.refresh_token
      });

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
    if (!user.auth) {
      setResumingSession(false);
      clearTimeout(refreshTimeoutId);
      setRefreshTimeoutId(undefined);
      if (debug) console.log('No session');
      return;
    }

    const tokenExpirationTime = user.auth.expirationTime;
    const now = Date.now();
    const refreshTokenExpirationTime = user.auth.refreshExpirationTime;
    const offset = 5 * 1000;
    const timeUntilRefresh = tokenExpirationTime - now - offset; // 1 minute before expiration

    if (timeUntilRefresh <= 0) {
      if (debug) console.log('Token has expired');
      if (now > refreshTokenExpirationTime) {
        if (debug) console.log('Refresh token has expired');

        setUser((user: any) => ({ ...user, auth: null, userDetails: null, ability: null }));
        setResumingSession(false);
      } else {
        if (debug) console.log('Refresh token has not expired yet');

        refreshToken().then(() => {
          setResumingSession(false);
        });
      }
    } else {
      setResumingSession(false);
      if (debug)
        console.log('Token has not expired yet, it expires in: ', `${(tokenExpirationTime - now) / 1000}s`);
      const timeoutId = setTimeout(refreshToken, timeUntilRefresh);
      setRefreshTimeoutId(timeoutId);
      if (debug)
        console.log(
          `scheduled refresh ${offset / 1000}s before it expires, after: ${timeUntilRefresh / 1000}s`
        );
    }
  }, [user.auth]);

  return <>{resumingSession ? <Backdrop open></Backdrop> : <>{children}</>}</>;
};
