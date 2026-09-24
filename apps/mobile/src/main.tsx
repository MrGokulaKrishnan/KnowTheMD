import React from 'react';
import ReactDOM from 'react-dom/client';
import '@knowthemd/ui/styles.css';
import { MobileApp } from './MobileApp';
import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MobileApp />
    </ErrorBoundary>
  </React.StrictMode>
);
