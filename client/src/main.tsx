import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GlobalStyle } from './style/GlobalStyle';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
