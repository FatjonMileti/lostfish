import React, { useState, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import NotFound from './pages/404';
import { PreviewComponents } from './pages/PreviewComponents';
import { HomeLoggedIn } from './pages/HomeLoggedIn/HomeLoggedIn';
import { Home } from './pages/Home/Home';
import { VerifyAccount } from './pages/CreateAccount/VerifyAccount';
import { Messages } from './pages/Messages/Messages';
import config from './config';
import SocketContext from './context/SocketContext';
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
import { InitialSetupModal } from './pages/InitialSetup/InitialSetupModal/InitialSetupModal';
import { useProfileStore } from './globalState/profile';
import { useNotificationsStore } from './globalState/notifications';

import { CookieConsent } from './components/CookieConsent';
import { MyMatches } from './pages/Matches/MyMatches';
import { GlobalLoading } from './components/Backdrop';

function App() {
  const userStore = useUserStore();
  const criteriaStore = useCriteriaStore();
  const profileStore = useProfileStore();
  const notificationsStore = useNotificationsStore();

  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    if (userStore.auth) {
      criteriaStore.fetchCriteria(userStore.auth.access_token);
      notificationsStore.fetchNotifications(userStore.auth.access_token);
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
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userStore?.userDetails?.user_id]);

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <>
      <GlobalLoading />
      <SessionMaintainer debug>
        <SocketContext.Provider value={value}>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/policy-agreement' element={<PolicyAgreement />} />
                <Route path='/agreement/:id' element={<AgreementDetails />} />
                <Route path='/components' element={<PreviewComponents />} />
                <Route path='/google/redirect' element={<RedirectUriPage />} />
                <Route path='/twitter/redirect' element={<RedirectUriTwitterPage />} />
                <Route path='/activate-account/:token' element={<VerifyAccount />} />

                <Route
                  path=''
                  element={
                    !!userStore.auth ? (
                      <>{profileStore.hasCompletedInitialSetup ? <HomeLoggedIn /> : <InitialSetupModal />}</>
                    ) : (
                      <Home />
                    )
                  }
                />

                <Route path='/agreement' element={<Agreement />} />

                <Route path='/my-matches' element={!!userStore.auth ? <MyMatches /> : <Home />} />
                <Route path='/messages' element={!!userStore.auth ? <Messages /> : <Home />} />
                <Route path='/my-account/*' element={!!userStore.auth ? <MyAccount /> : <Home />} />
                <Route path='/dashboard/*' element={!!userStore.auth ? <MyDashboard /> : <Home />} />

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
