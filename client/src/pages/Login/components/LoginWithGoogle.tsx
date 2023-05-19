import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import React from 'react';
import config from '../../../config';

export const LoginWithGoogle = (props: any) => {
  const { onSuccess } = props;

  const handleCodemessage = (event: any) => {
    if (event?.data?.code === undefined) return;
    const { code } = event.data;
    onSuccess({ code });
    window.removeEventListener('message', handleCodemessage);
  };

  const handleLoginClick = () => {
    const authUrl = `${config.googleAuthFullUrl}`;
    const popupWindow = window.open(authUrl, '_blank');
    window.addEventListener('message', handleCodemessage);
    if (popupWindow) {
      popupWindow.focus();
    }
  };

  return (
    <Button variant='secondary' onClick={handleLoginClick}>
      <Icon icon='google' />
    </Button>
  );
};
