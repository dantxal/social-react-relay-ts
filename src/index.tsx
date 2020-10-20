import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.unstable_createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)