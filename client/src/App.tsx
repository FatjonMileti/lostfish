import React, { useState, useMemo } from 'react';
import { registerStore, useGlobalState } from './globalState/globalState';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import NotFound from './pages/404';
import { Login } from './pages/Login/Login';
import { PreviewComponents } from './pages/PreviewComponents';
import { HomeLoggedIn } from './pages/HomeLoggedIn/HomeLoggedIn';
import { Home } from './pages/Home/Home';
import { CreateAccount } from './pages/CreateAccount/CreateAccount';
import { VerifyAccount } from './pages/CreateAccount/VerifyAccount';
import { Messages } from './pages/Messages/Messages';
import { Properties } from './pages/Properties/Properties';
import { Matches } from './pages/Matches/Matches';
import config from './config';
import SocketContext from './context/SocketContext';
import { About } from './pages/About/About';
import { Mission } from './pages/Mission/Mission';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import request from './utils/axios';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { MyAccount } from './pages/MyAccount/MyAccount';
import { RedirectUriPage } from './pages/Login/components/Redirect';
import { UserProvider } from './context/UserProvider';
import { SessionMaintainer } from './pages/Login/SessionMaintainer';
import { RedirectUriTwitterPage } from './pages/Login/components/RedirectTwitter';
import { useUserStore } from './globalState/user';
import { useCriteriaStore } from './globalState/criteria';

import { AgreementDetails } from './pages/Agreement/scenes/AgreementDetails';
import { MyDashboard } from './pages/AgentDashboard/MyDashboard';
import { Agreement } from './pages/Agreement/Agreement';
import { PolicyAgreement } from './pages/Agreement/PolicyAgreement';
import { InitialSetup } from './pages/InitialSetup/InitialSetup';
import { useProfileStore } from './globalState/profile';
import { CookieConsent } from './components/CookieConsent';

registerStore(
  'notification',
  {
    unread: 0,
    list: []
  },
  { persist: true }
);

function App() {
  const userStore = useUserStore();
  const criteriaStore = useCriteriaStore();
  const profileStore = useProfileStore();

  const {
    notification: [notification, setNotification]
  } = useGlobalState();

  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    if (userStore.auth) {
      criteriaStore.fetchCriteria(userStore.auth.access_token);
    } else {
      criteriaStore.reset();
    }
  }, [userStore.auth]);

  React.useEffect(() => {
    if (userStore.auth) {
      const socketOpt = {
        ...(process.env.REACT_APP_NODE_ENV !== 'development' && { transports: ['websocket'] }),
        auth: {
          token: userStore.auth.access_token
        }
      };
      // console.log(socketOpt);
      // @ts-ignore
      const newSocket = io(config.apiUrl, {
        ...(process.env.REACT_APP_NODE_ENV !== 'development' && { transports: ['websocket'] }),
        auth: {
          token: userStore.auth.access_token
        }
      });
      setSocket(newSocket);

      getUnreadMessages();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userStore?.userDetails?.user_id]);

  const getUnreadMessages = async () => {
    const response = await request(userStore.auth.access_token).get('/api/notification/unread');
    setNotification((prevNotification: any) => ({ ...prevNotification, unread: response.data.unread }));
  };

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <>
      <SessionMaintainer debug>
        <SocketContext.Provider value={value}>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/policy-agreement' element={<PolicyAgreement />} />
                <Route path='/agreement/:id' element={<AgreementDetails />} />
                <Route path='/components' element={<PreviewComponents />} />
                <Route path='/about' element={<About />} />
                <Route path='/mission' element={<Mission />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/create-account' element={<CreateAccount />} />
                <Route path='/google/redirect' element={<RedirectUriPage />} />
                <Route path='/twitter/redirect' element={<RedirectUriTwitterPage />} />
                <Route path='/activate-account/:token' element={<VerifyAccount />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />

                <Route
                  path=''
                  element={
                    !!userStore.auth ? (
                      <>
                        {!profileStore.avatar ||
                        !criteriaStore.lookingFor ||
                        (userStore?.userDetails?.role === 'Tenant' && !criteriaStore.areaOfInterest) ? (
                          <InitialSetup />
                        ) : (
                          <HomeLoggedIn />
                        )}
                      </>
                    ) : (
                      <Home />
                    )
                  }
                />

                {userStore?.userDetails?.role === 'Landlord' && (
                  <Route path='/properties' element={!!userStore.auth ? <Properties /> : <Login />} />
                )}

                <Route path='/agreement' element={<Agreement />} />
                <Route path='/matches' element={!!userStore.auth ? <Matches /> : <Login />} />
                <Route path='/messages' element={!!userStore.auth ? <Messages /> : <Login />} />
                <Route path='/my-account/*' element={!!userStore.auth ? <MyAccount /> : <Login />} />
                <Route path='/dashboard/*' element={!!userStore.auth ? <MyDashboard /> : <Login />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </SocketContext.Provider>
      </SessionMaintainer>
      <CookieConsent />
    </>
  );
}
export default App;
