import React from 'react';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button';
import { LoginSocialFacebook } from 'reactjs-social-login';

type FacebookLoginProps = {
  appId: string;
  onLoginSuccess: (accessToken: string) => void;
  onLoginFailure: (error: string) => void;
  scope?: string;
};

export const LoginWithFacebook: React.FC<FacebookLoginProps> = ({
  appId,
  onLoginSuccess,
  onLoginFailure,
  scope = 'email'
}) => {
  return (
    <LoginSocialFacebook
      appId={appId}
      onResolve={(response) => {
        if (response?.data?.accessToken) {
          onLoginSuccess(response.data.accessToken);
        } else {
          onLoginFailure('failed_to_login_facebook');
        }
      }}
      scope={scope}
      onReject={(error) => {
        onLoginFailure('failed_to_login_facebook');
      }}>
      <Button variant='secondary'>
        <Icon icon='facebook' />
      </Button>
    </LoginSocialFacebook>
  );
};
