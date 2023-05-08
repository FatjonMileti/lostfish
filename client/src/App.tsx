import { useGlobalState } from './globalState';
import { UIProvider, useUI } from './context/ui';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/routes/private';
import Layout from './layout';
import NotFound from './pages/404';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { hideMessage } from './actions/ui';
import IconButton from '@mui/material/IconButton';
import { Close, Message } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import { ChatPage } from './pages/Chat';

import { Login } from './pages/Login/Login';
import { PreviewComponents } from './pages/PreviewComponents';
import { HomeLoggedIn } from './pages/HomeLoggedIn/HomeLoggedIn';
import { Home } from './pages/Home/Home';
import { CreateAccount } from './pages/CreateAccount/CreateAccount';
import { SetPassword } from './pages/CreateAccount/SetPassword';
import { Messages } from './pages/Messages/Messages';
import { Properties } from './pages/Properties/Properties';
import { Matches } from './pages/Matches/Matches';

const GeneralSnackbar = () => {
  const UIContext = useUI();
  if (!UIContext) return null;

  return (
    <Snackbar
      open={UIContext.state.isSnackbarOpen}
      autoHideDuration={4000}
      // message={UIContext.state.message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={hideMessage(UIContext)}
      action={
        <IconButton size='small' aria-label='close' color='inherit' onClick={hideMessage(UIContext)}>
          <Close fontSize='small' />
        </IconButton>
      }>
      <Alert onClose={hideMessage(UIContext)} severity={UIContext.state.severity} sx={{ width: '100%' }}>
        {UIContext.state.message}
      </Alert>
    </Snackbar>
  );
};

function App() {
  const {
    user: [user]
  } = useGlobalState();

  return (
    <UIProvider>
      <GeneralSnackbar />

      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path={'/messages'} element={<ChatPage />} />
          <Route path='' element={!!user.auth ? <HomeLoggedIn /> : <Home />} />
          <Route path='/create-account' element={<CreateAccount />} />
          <Route path='/set-password/:token' element={<SetPassword />} />
          <Route path='/properties' element={<Properties />} />
          <Route path='/matches' element={<Matches />} />
          <Route path='/components' element={<PreviewComponents />} />
          <Route path='/messages-page' element={!!user.auth ? <Messages /> : <Login />} />
          <Route path='*' element={<NotFound />} />

          <Route
            path='/*'
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UIProvider>
  );
}

export default App;
