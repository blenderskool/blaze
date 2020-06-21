import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Router } from 'preact-router';

import Rooms from './Rooms';
import NewUser from './NewUser';
import FileTransfer from './FileTransfer';

import './app.scss';

export default function App() {
  const [isRegistered, setRegistered] = useState(!!window.localStorage.getItem('blaze'));
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = 'App | Blaze';
    if (!isRegistered) return;

    const scriptjs = require('scriptjs');

    scriptjs([
      'https://unpkg.com/canvas-elements/build/cdn/canvas-elements.min.js',
      'https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js'
    ], () => {
      setLoaded(true);
    });
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
            <Rooms path="/app/" />
            <FileTransfer path="/app/t/:room" />
          </Router>
        ) : null
      }
    </div>
  );
}