import React, { useState, useMemo } from 'react';
import { registerStore, useGlobalState } from './globalState/globalState';
import { UIProvider } from './context/ui';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import NotFound from './pages/404';
import { Login } from './pages/Login/Login';
import { PreviewComponents } from './pages/PreviewComponents';
import { HomeLoggedIn } from './pages/HomeLoggedIn/HomeLoggedIn';
import { Home } from './pages/Home/Home';
import { CreateAccount } from './pages/CreateAccount/CreateAccount';
import { VerifyAccount } from './pages/CreateAccount/VerifyAccount';
import { PrivateProperty } from './pages/Properties/pages/PrivateProperty';
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
import { ChatPage } from './pages/Chat';
import { PublicProperty } from './pages/Properties/pages/PublicProperty';
import { PropertyApplications } from './pages/Properties/pages/PropertyApplications';
import { UserProvider } from './context/UserProvider';
import { SessionMaintainer } from './pages/Login/SessionMaintainer';
import { RedirectUriTwitterPage } from './pages/Login/components/RedirectTwitter';
import { useUserStore } from './globalState/user';
import { useCriteriaStore } from './globalState/criteria';
import { useProfileStore } from './globalState/profile';
import { Agreement } from './pages/Agreement/Agreement';
import { AgreementDetails } from './pages/Agreement/scenes/AgreementDetails';
import { AgentDashboard } from './pages/AgentDashboard/AgentDashboard';

registerStore(
  'notification',
  {
    unread: 0,
    list: []
  },
  { persist: true }
);

function App() {
  const user = useUserStore();
  const criteriaStore = useCriteriaStore();
  const profileStore = useProfileStore();

  const {
    notification: [notification, setNotification]
  } = useGlobalState();

  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    if (user.auth) {
      criteriaStore.fetchCriteria(user.auth.access_token);
    } else {
      criteriaStore.reset();
    }
  }, [user.auth]);

  React.useEffect(() => {
    if (user.auth) {
      profileStore.fetchProfile(user.auth.access_token);
    } else {
      profileStore.reset();
    }
  }, [user.auth]);

  React.useEffect(() => {
    if (user.auth) {
      // @ts-ignore
      const newSocket = io(config.apiUrl, {
        auth: {
          token: user.auth.access_token
        }
      });
      setSocket(newSocket);

      getUnreadMessages();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const getUnreadMessages = async () => {
    const response = await request(user.auth.access_token).get('/api/notification/unread');
    setNotification((prevNotification: any) => ({ ...prevNotification, unread: response.data.unread }));
  };

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <>
      <SessionMaintainer>
        <SocketContext.Provider value={value}>
          <UserProvider>
            <UIProvider>
              <BrowserRouter>
                <Routes>
                  <Route path='/login' element={<Login />} />
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

                  <Route path='' element={!!user.auth ? <HomeLoggedIn /> : <Home />} />
                  <Route path='/dashboard' element={<AgentDashboard />} />
                  <Route path='/contracts' element={<Agreement />} />
                  <Route path='/agent-property' element={<div>Property list</div>} />
                  <Route path='/agent-matches' element={<div>Matches list</div>} />
                  <Route path='/properties' element={!!user.auth ? <Properties /> : <Login />} />
                  <Route path='/messages' element={<ChatPage />} />
                  <Route path='/properties/:id' element={<PrivateProperty />} />
                  <Route path='/properties/:id/view' element={<PublicProperty />} />
                  <Route path='/properties/:id/applications' element={<PropertyApplications />} />
                  <Route path='/matches' element={<Matches />} />
                  <Route path='/messages-page' element={!!user.auth ? <Messages /> : <Login />} />
                  <Route path='my-account/*' element={!!user.auth ? <MyAccount /> : <Login />} />
                  <Route path='*' element={<NotFound />} />

                  {/* <Route */}
                  {/*   path='/*' */}
                  {/*   element={ */}
                  {/*     <PrivateRoute> */}
                  {/*       <Layout> */}
                  {/*         <Routes> */}
                  {/*           <Route path='*' element={<NotFound />} /> */}
                  {/*         </Routes> */}
                  {/*       </Layout> */}
                  {/*     </PrivateRoute> */}
                  {/*   } */}
                  {/* /> */}
                </Routes>
              </BrowserRouter>
            </UIProvider>
          </UserProvider>
        </SocketContext.Provider>
      </SessionMaintainer>
    </>
  );
}
export default App;
