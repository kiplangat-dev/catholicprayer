import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { databaseService } from './services/databaseService';

// Initialize database on app start
databaseService.init().then((success) => {
  console.log('Database initialized:', success);
  
  // Start the app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  // Still render app even if database fails
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
