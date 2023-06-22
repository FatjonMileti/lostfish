import React from 'react';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import config from '../../../config';
import { LoginSocialApple, IResolveParams } from 'reactjs-social-login';
const REDIRECT_URI = `${config.redirect_uri}`;

export const LoginWithApple = (props: any) => {
  const { onSuccess } = props;
  const [provider, setProvider] = React.useState('');
  const [profile, setProfile] = React.useState<any>();

  const onLoginStart = React.useCallback(() => {
    console.log('login start');
  }, []);

  const onLogoutSuccess = React.useCallback(() => {
    setProfile(null);
    setProvider('');
  }, []);

  const onLogout = React.useCallback(() => {}, []);

  return (
    <LoginSocialApple
      client_id={config.apple.client_id || ''}
      scope={'name email'}
      redirect_uri={REDIRECT_URI}
      onLoginStart={onLoginStart}
      onResolve={({ provider, data }: IResolveParams) => {
        setProvider(provider);
        setProfile(data);
        onSuccess({ provider, data });
      }}
      onReject={(err) => {
        console.log(err);
      }}>
      <Button variant='secondary'>
        <Icon icon='apple' />
      </Button>
    </LoginSocialApple>
  );
};
