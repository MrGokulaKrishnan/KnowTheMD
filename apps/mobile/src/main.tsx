import React from 'react';
import ReactDOM from 'react-dom/client';
import '@knowthemd/ui/styles.css';
import { MobileApp } from './MobileApp';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>
);
