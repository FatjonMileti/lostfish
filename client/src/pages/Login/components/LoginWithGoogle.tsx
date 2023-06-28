import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import React, { useCallback } from 'react';
import config from '../../../config';
import { LoginSocialGoogle, IResolveParams } from 'reactjs-social-login';
export const LoginWithGoogle = (props: any) => {
  const { onSuccess } = props;

  const onLoginStart = useCallback(() => {
    console.log('login start');
  }, []);

  return (
    <LoginSocialGoogle
      client_id={config.google.google_app_id || ''}
      onLoginStart={onLoginStart}
      redirect_uri={config.google.redirect_page || ''}
      scope='profile email'
      discoveryDocs='claims_supported'
      access_type='offline'
      onResolve={({ provider, data }: IResolveParams) => {
        onSuccess({ provider, user: data });
      }}
      onReject={(err) => {
        console.log(err);
      }}>
      <Button variant='secondary'>
        <Icon icon='google' />
      </Button>
    </LoginSocialGoogle>
  );
};
