import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';

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
import { TransitionRouter, TransitionRoute } from '../../components/TransitionRouter';

import './app.scss';

const updateLocalStorageSchema = () => {
  if (typeof window === 'undefined') return;

  const v2Converter = (data) => {
    data.rooms = data.rooms.map(room => typeof room === 'string' ? ({ name: room, lastJoin: new Date().getTime() }) : room);
  };

  const data = JSON.parse(window.localStorage.getItem('blaze'));
  v2Converter(data);

  window.localStorage.setItem('blaze', JSON.stringify(data));
};


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
      updateLocalStorageSchema();
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
    return <NewUser onRegister={() => setRegistered(true)} />;
  }

  return isLoaded ? (
    <QueuedFiles.Provider value={{ queuedFiles, setQueuedFiles }}>
      <PWAInstallProvider>
        <TransitionRouter>
          <TransitionRoute key="rooms" path="/app/">
            <Rooms isOnline={isOnline} />
          </TransitionRoute>
          <TransitionRoute key="file-transfer" path="/app/t/:room?">
            <FileTransfer />
          </TransitionRoute>
          <TransitionRoute key="instant-room" path="/app/instant/join">
            <JoinInstantRoom />
          </TransitionRoute>
          <TransitionRoute key="404" default>
            <RedirectToFourOFour />
          </TransitionRoute>
        </TransitionRouter>
      </PWAInstallProvider>
    </QueuedFiles.Provider>
  ) : <Loading fullScreen />;
}
