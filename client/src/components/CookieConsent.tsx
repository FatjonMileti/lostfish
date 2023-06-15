import React from 'react';
import { styled } from '@mui/system';
import { Button } from './Button';
import { useCookies } from 'react-cookie';

export const CookieConsent = styled(() => {
  const [cookies, setCookie] = useCookies(['acceptCookies']);

  React.useEffect(() => {}, []);

  const handleAllowCookies = () => {
    setCookie('acceptCookies', 'true');
  };

  const handleRejectCookies = () => {
    setCookie('acceptCookies', 'false');
  };

  if (Object(cookies).hasOwnProperty('acceptCookies') && cookies.acceptCookies === 'true') {
    return null;
  }

  if (Object(cookies).hasOwnProperty('acceptCookies') && cookies.acceptCookies === 'false') {
    return (
      <div className='cookie-consent'>
        <div className='cookie-content'>
          We're sorry to hear that. Some features of the website may not work without cookies.
        </div>
        <div className='cookie-content'>
          If you change your mind, you can update your preferences in the website's settings.
        </div>
      </div>
    );
  }

  return (
    <div className='cookie-consent'>
      <div className='cookie-content'>
        This website uses cookies to ensure you get the best experience. By using our site, you acknowledge
        that you have read and understand our <a href='/privacy-policy'>Privacy Policy</a>.
      </div>
      <div>
        <Button onClick={handleAllowCookies}>Allow Cookies</Button>
        <Button onClick={handleRejectCookies}>Reject Cookies</Button>
      </div>
    </div>
  );
})`
  &.cookie-consent {
    background-color: lightgreen !important;
    padding: 10px;
    .cookie-content {
      color: white;
      margin-bottom: 10px;
    }
  }
`;
