import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';

import theme from './theme';

import NotFound from './pages/404';
// import Login from './pages/login';

import { UserProvider } from './context/user';
import { UIProvider, useUI } from './context/ui';
import { startLoading, stopLoading, hideMessage } from './actions/ui';

import Alert from '@mui/material/Alert';

import PrivateRoute from './components/routes/private';

import Layout from './layout';
import './assets/css/Index.css';
import { PublicLayout } from './layout/public/PublicLayout';

//
import { Home } from './pages/Home/Home';
import { PreviewComponents } from './pages/PreviewComponents';
import { Login } from './pages/Login/Login';
import { Intersection } from './pages/Home/Intersection';
//
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
const container = document.getElementById('root') as HTMLElement;
// @ts-ignore
const rootContainer = ReactDOMClient.createRoot(container!);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <UIProvider>
          <GeneralSnackbar />

          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/intersection' element={<Intersection />} />
              <Route path='/components' element={<PreviewComponents />} />
              <Route
                path='/'
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />

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
      </UserProvider>
    </ThemeProvider>
  );
}

rootContainer.render(<App />);
