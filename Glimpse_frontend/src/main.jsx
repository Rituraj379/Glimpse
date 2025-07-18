import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('main.jsx render, Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router>
      <App />
    </Router>
  </GoogleOAuthProvider>
);
