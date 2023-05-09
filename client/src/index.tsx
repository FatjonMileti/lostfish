import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStateProvider } from './globalState';
import App from './App';
import './assets/css/Index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
