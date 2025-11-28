window.global = window;

// === KHẮC PHỤC LỖI setImmediate CHO DRAFT.JS ===
if (typeof setImmediate === 'undefined') {
  window.setImmediate = (callback, ...args) => {
    return setTimeout(callback, 0, ...args);
  };
}

import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './App.css'
import ConfirmProvider from './context/ConfirmProvider.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfirmProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '18px',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: 'white',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </ConfirmProvider>
  </StrictMode>,
)
