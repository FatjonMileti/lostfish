import { useUser } from '../../context/user';
import { Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { logout, refresh as refreshToken } from '../../actions/user';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default (props: any) => {
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const navigate = useNavigate();

  if (!user) return;

  const forceLogout = () => {
    logout(user)();
    navigate('/login');
  };
  const timeOffset = 1000 * 60;
  useEffect(() => {
    (async () => {
      if (!user.state.token || !user.state.refreshToken) {
        //clear localStorage just in case the user removes a token manually
        return forceLogout(); //⛔
      } else {
        try {
          const tokenPayload = JSON.parse(window.atob(user.state.token.split('.')[1]));
          const refreshPayload = JSON.parse(window.atob(user.state.refreshToken.split('.')[1]));

          const now = new Date().getTime();
          const refreshExpiresAt = new Date(refreshPayload.exp * 1000).getTime();
          const tokenExpiresAt = new Date(tokenPayload.exp * 1000).getTime();
          //refresh token expired => reload()
          if (refreshExpiresAt <= now) {
            console.info('refresh token expired');
            return forceLogout(); //⛔
          }
          //token expired but refresh valid
          if (tokenExpiresAt <= now) {
            //should get a new token
            console.info('token expired');
            if (!user.state.rememberMe) {
              console.info('rememberMe false');
              return forceLogout();
            }
            const refreshedToken = await refreshToken(user)();
            if (!refreshedToken || !user.state.token) return forceLogout(); //⛔

            setLoading(false);
          } else {
            //token still valid, set a timer to refresh
            console.info('token still valid');
            console.info(`refresh in ${tokenExpiresAt - now - timeOffset} ms`);
            setTimeout(async () => {
              const refreshedToken = await refreshToken(user)();
              if (!refreshedToken || !user.state.token) return forceLogout(); //⛔
            }, tokenExpiresAt - now - timeOffset);

            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          return forceLogout(); //⛔
        }
      }
    })();
  }, [user.state.token, user.state.refreshToken]);

  if (loading)
    return (
      <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={true}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  else {
    return user && user.state.username ? props.children : <Navigate to='/login' />;
  }
};
