import React from 'react';
import { styled } from '@mui/system';
import { Button } from './Button';
import { useCookies } from 'react-cookie';
import {Typography} from "./Typography";
import {Link} from './Link';
import {useNavigate} from "react-router-dom";

export const CookieConsent = styled(({className=''}: React.HTMLAttributes<HTMLDivElement>) => {
  const [cookies, setCookie] = useCookies(['acceptCookies']);
    const navigate = useNavigate();

  React.useEffect(() => {}, []);

  const handleAllowCookies = () => {
    setCookie('acceptCookies', 'true');
  };

  const handleRejectCookies = () => {
    setCookie('acceptCookies', 'false');
      setTimeout(function(){
          setCookie('acceptCookies', '');
      }, 2000);
  };

  if (Object(cookies).hasOwnProperty('acceptCookies') && (cookies.acceptCookies === 'true' || cookies.acceptCookies === '')) {
    return null;
  }

  if (Object(cookies).hasOwnProperty('acceptCookies') && cookies.acceptCookies === 'false') {
    return (
      <div className={`consent ${className}`}>
            <Typography
                variant='body4' className='content'>
                We're sorry to hear that. Some features of the website may not work without cookies.
            </Typography>
          <Typography
              variant='body4' className='content'>
          If you change your mind, you can update your preferences in the website's settings.
          </Typography>
      </div>
    );
  }

  return (
    <div className={`consent ${className}`}>
        <div className="content">
            <Typography variant='body4'>
                This website uses cookies to ensure you get the best experience. By using our site, you acknowledge
                that you have read and understand our
            </Typography>
            <Link variant='body4' onClick={() => navigate('/policy-agreement')}>Privacy Policy</Link>
        </div>



      <div className='buttons'>
        <Button onClick={handleAllowCookies}>Allow Cookies</Button>
        <Button onClick={handleRejectCookies}>Reject Cookies</Button>
      </div>
    </div>
  );
})`
  &.consent {
    background-color: #afabab;
    padding: 20px;
    height: max-content;
    width: 100%;
    display: grid;
    gap: 20px;
    justify-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    
    .content {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .buttons {
      display: flex;
      flex-wrap: wrap;
     gap: 10px;
    }
  }
`;
