import React from 'react';
import axios from 'axios';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import config from '../../../config';
import { LoginSocialTwitter, IResolveParams } from 'reactjs-social-login';
const REDIRECT_URI = `${config.redirect_uri}`;

/*TODO Finish this after setting up twitter account*/
export const LoginWithTwitter = (props: any) => {
  const { onSuccess } = props;
  const [provider, setProvider] = React.useState('');
  const [profile, setProfile] = React.useState<any>();
  const handleCodeMessage = (event: any) => {
    if (event?.data?.code === undefined) return;
    const { code, state } = event.data;
    onSuccess({ code, state });
    window.removeEventListener('message', handleCodeMessage);
  };

  const getUrl = async () => {
    const response = await axios.get(`${config.apiUrl}/api/account/create-twitter-url`);
    const authUrl = `${response.data.authUrl}`;
    const popupWindow = window.open(authUrl, '_blank');

    if (popupWindow) {
      popupWindow.opener = window;
      popupWindow.focus();
    }

    window.addEventListener('message', handleCodeMessage);
  };

  const onLoginStart = React.useCallback(() => {
    console.log('login start');
  }, []);

  const onLogoutSuccess = React.useCallback(() => {
    setProfile(null);
    setProvider('');
  }, []);

  const onLogout = React.useCallback(() => {}, []);

  return (
    <LoginSocialTwitter
      client_id={config.twitter.client_id || ''}
      // client_secret={process.env.REACT_APP_TWITTER_V2_APP_SECRET || ''}
      redirect_uri={REDIRECT_URI}
      onLoginStart={onLoginStart}
      onLogoutSuccess={onLogoutSuccess}
      onResolve={({ provider, data }: IResolveParams) => {
        setProvider(provider);
        setProfile(data);
        console.log({ data });
      }}
      onReject={(err: any) => {
        console.log(err);
      }}>
      <Button variant='secondary'>
        <Icon icon='twitter' />
      </Button>
    </LoginSocialTwitter>
  );
};
