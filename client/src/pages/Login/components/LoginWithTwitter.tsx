import React, { useCallback } from 'react';
import axios from 'axios';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import config from '../../../config';
import { LoginSocialTwitter, IResolveParams } from 'reactjs-social-login';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosWithToken from '../../../utils/axios';
import { buildAbilityFor } from '../../../utils/ability.util';
import { unpackRules } from '@casl/ability/dist/types/extra';
import { decodeJWT } from '../Login';

const TWITTER_CLIENT_ID = config.twitter.client_id; // give your twitter client id here

// twitter oauth Url constructor
function getTwitterOauthUrl() {
  const rootUrl = 'https://twitter.com/i/oauth2/authorize';
  const options = {
    redirect_uri: 'http://www.localhost:3000/api/account/login-twitter-callback', // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
    client_id: TWITTER_CLIENT_ID,
    state: 'state',
    response_type: 'code',
    code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
    code_challenge_method: 'S256',
    scope: ['users.read', 'tweet.read'].join(' ') // add/remove scopes as needed
  };
  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
}

// the component
export const LoginWithTwitter = (props: any) => {
  const navigate = useNavigate();
  const goTo = () => {
    const url = getTwitterOauthUrl();
    window.location.href = url;
  };
  return (
    <Button variant='secondary' onClick={() => goTo()}>
      <Icon icon='twitter' />
    </Button>
  );
};

// export const LoginWithTwitter = (props: any) => {
//   const { onSuccess } = props;
//
//   const onLoginStart = useCallback(() => {
//     console.log('login start');
//   }, []);
//
//   const handleCodeMessage = (event: any) => {
//     if (event?.data?.code === undefined) return;
//     const { code, state } = event.data;
//     onSuccess({ code, state });
//     window.removeEventListener('message', handleCodeMessage);
//   };
//
//   const loginWithTwitter = async (response: { provider: string; data: any }) => {
//     try {
//       const getAuthData = await axios.post(config.apiUrl + '/api/account/login-twitter-callback', {
//         code: response.data.code
//       });
//       console.log({ getAuthData });
//     } catch (err) {
//       console.log(err);
//       //handle error
//     }
//   };
//
//   return (
//     <LoginSocialTwitter
//       client_id={config.twitter.client_id || ''}
//       isOnlyGetCode={true}
//       redirect_uri={'http://www.localhost:3000/api/account/login-twitter-callback' ?? ''}
//       onReject={(err) => {
//         console.log(err, 'errrr');
//       }}
//       onResolve={({ provider, data }: IResolveParams) => {
//         console.log({ provider, data });
//         loginWithTwitter({ provider, data });
//       }}>
//       <Button variant='secondary'>
//         <Icon icon='twitter' />
//       </Button>
//     </LoginSocialTwitter>
//   );
// };
