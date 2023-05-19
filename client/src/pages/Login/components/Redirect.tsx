import React from 'react';
import { useLocation } from 'react-router-dom';

export const RedirectUriPage = () => {
  const params = new URLSearchParams(useLocation().search);
  const code = params.get('code');
  React.useEffect(() => {
    window.opener.postMessage({ code });
    window.close();
  }, []);
  return null;
};
