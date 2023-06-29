import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { buildAbilityFor } from '../../../utils/ability.util';
import { unpackRules } from '@casl/ability/extra';
import { decodeJWT } from '../Login';
import { useGlobalState } from '../../../globalState';

export const RedirectUriTwitterPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['oauth2_token', 'username', 'acceptCookies']);
  console.log({ cookies });

  const navigate = useNavigate();
  const {
    user: [user, setUser]
  } = useGlobalState();

  React.useEffect(() => {
    if (cookies && cookies.oauth2_token) {
      const auth = cookies.oauth2_token;
      const userDetails = decodeJWT(auth.access_token);
      const ability = buildAbilityFor(userDetails!.role, unpackRules(auth.rules));
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
      // removeCookie('oauth2_token');
    }
  }, []);

  React.useEffect(() => {
    if (!!user.auth) navigate('/');
  }, [user.auth]);

  console.log({ user });

  return <p>Loading...</p>;
};
