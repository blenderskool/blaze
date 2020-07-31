import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Router, route } from 'preact-router';

import Rooms from './Rooms/Rooms';
import NewUser from './NewUser/NewUser';
import FileTransfer from './FileTransfer/FileTransfer';

import './app.scss';

export default function App() {
  const [isRegistered, setRegistered] = useState(!!window.localStorage.getItem('blaze'));
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [isLoaded, setLoaded] = useState(false);
  
  const handleNetworkStatus = () => {
    if (!navigator.onLine) {
      route('/app', true);
    }
    setOnline(navigator.onLine);
  };

  useEffect(() => {
    document.title = 'App | Blaze';
    if (!isRegistered) return;

    window.addEventListener('offline', handleNetworkStatus);
    window.addEventListener('online', handleNetworkStatus);

    const scriptjs = require('scriptjs');

    scriptjs([
      'https://unpkg.com/canvas-elements/build/cdn/canvas-elements.min.js',
      'https://cdn.jsdelivr.net/npm/webtorrent@0.108.6/webtorrent.min.js',
    ], () => {
      setLoaded(true);
    });

    return () => {
      window.removeEventListener('online', handleNetworkStatus);
      window.removeEventListener('offline', handleNetworkStatus);
    };
  }, [isRegistered]);

  if (!isRegistered) {
    return (
      <div class="app-container">
        <NewUser onRegister={() => setRegistered(true)} />
      </div>
    );
  }

  return (
    <div class="app-container">
      {
        isLoaded ? (
          <Router>
            <Rooms path="/app/" isOnline={isOnline} />
            <FileTransfer path="/app/t/:room" />
          </Router>
        ) : null
      }
    </div>
  );
}