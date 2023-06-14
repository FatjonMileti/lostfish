import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStateProvider } from './globalState';
import App from './App';
import './assets/css/Index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <GlobalStateProvider>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </GlobalStateProvider>
);
