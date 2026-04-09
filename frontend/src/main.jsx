import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Make sure this path is correct
import { ToastProvider } from "./contexts/ToastContext";
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
    <BrowserRouter>
      {/* 1. AuthProvider MUST be inside BrowserRouter but OUTSIDE App */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);