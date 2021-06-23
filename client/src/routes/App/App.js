import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Router, route } from 'preact-router';

import { useOnline, useSWMessage } from '../../hooks';
import constants from '../../../../common/constants';
import { QueuedFiles } from './contexts/QueuedFiles';
import { PWAInstallProvider } from './contexts/PWAInstall';
import Rooms from './Rooms/Rooms';
import NewUser from './NewUser/NewUser';
import FileTransfer from './FileTransfer/FileTransfer';
import JoinInstantRoom from './JoinInstantRoom/JoinInstantRoom';
import { RedirectToFourOFour } from '../Pages/FourOFour/FourOFour';
import Loading from '../../components/Loading/Loading';

import './app.scss';

export default function App() {
  const [isLoaded, setLoaded] = useState(false);
  const [isRegistered, setRegistered] = useState(typeof window !== 'undefined' ? !!window.localStorage.getItem('blaze') : true);
  const isOnline = useOnline();
  const [queuedFiles, setQueuedFiles] = useSWMessage([], constants.SW_LOAD_FILES);

  /* Mount specific effects */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    navigator.serviceWorker?.controller?.postMessage(constants.SW_SHARE_READY);
  }, []);

  /* Loading extra scripts */
  useEffect(() => {
    if (!isRegistered) return;

    const scriptjs = require('scriptjs');

    scriptjs([
      'https://unpkg.com/canvas-elements/build/cdn/canvas-elements.min.js',
      'https://cdn.jsdelivr.net/npm/webtorrent@0.108.6/webtorrent.min.js',
    ], () => {
      setLoaded(true);
    });
  }, [isRegistered]);

  /* Changing route when offline */
  useEffect(() => {
    if (isRegistered && !isOnline) {
      route('/app', true);
    }
  }, [isRegistered, isOnline]);


  if (!isRegistered) {
    return (
      <div class="app-container">
        <NewUser onRegister={() => setRegistered(true)} />
      </div>
    );
  }

  return (
    <main class="app-container">
      {
        isLoaded ? (
          <QueuedFiles.Provider value={{ queuedFiles, setQueuedFiles }}>
            <PWAInstallProvider>
              <Router>
                <Rooms path="/app/" isOnline={isOnline} />
                <FileTransfer path="/app/t/:room" />
                <JoinInstantRoom path="/app/instant/join" />
                <RedirectToFourOFour default />
              </Router>
            </PWAInstallProvider>
          </QueuedFiles.Provider>
        ) : <Loading fullScreen />
      }
    </main>
  );
}