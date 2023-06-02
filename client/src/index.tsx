import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStateProvider } from './globalState';
import App from './App';
import './assets/css/Index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
// {
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: true,
//           refetchOnReconnect: true,
//           retry: true,
//           staleTime: twentyFourHoursInMs
//     }
//   }
// }
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <GlobalStateProvider>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </GlobalStateProvider>
);
