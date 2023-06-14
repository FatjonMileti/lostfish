import React, { useEffect } from 'react';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button';

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
  useEffect(() => {
    const loadFacebookSDK = () => {
      // Load the Facebook SDK asynchronously
      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v11.0'
        });
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
        let js: any,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    };

    const initFacebookSDK = () => {
      (window as any).FB?.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          onLoginSuccess(response.authResponse.accessToken);
        }
      });
    };

    loadFacebookSDK();
    initFacebookSDK();
  }, [appId, onLoginSuccess]);

  const handleFacebookLogin = () => {
    (window as any).FB.login(
      function (response: any) {
        if (response.authResponse) {
          onLoginSuccess(response.authResponse.accessToken);
        } else {
          onLoginFailure('Facebook login failed');
        }
      },
      { scope }
    );
  };

  return (
    <Button variant='secondary' onClick={() => handleFacebookLogin()}>
      <Icon icon='facebook' />
    </Button>
  );
};
