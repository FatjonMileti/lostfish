import React from 'react';
import axios from 'axios';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import config from '../../../config';
export const LoginWithTwitter = (props: any) => {
  const { onSuccess } = props;

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

    window.addEventListener('message', handleCodeMessage);
    if (popupWindow) {
      popupWindow.focus();
    }
  };

  return (
    <Button variant='secondary' onClick={() => getUrl()}>
      <Icon icon='twitter' />
    </Button>
  );
};
