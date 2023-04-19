import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStateProvider } from './globalState';
import App from './App';
import './assets/css/Index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>
);
