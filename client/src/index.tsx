import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStateProvider } from './globalState';
import App from './App';
import './assets/css/Index.css';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
