import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import {
  createLocalStorageDispatch,
  useLocalStorageSelector,
} from 'react-localstorage-hooks';

import constants from '../../../../common/constants';
import Loading from '../../components/Loading/Loading';
import {
  TransitionRoute,
  TransitionRouter,
} from '../../components/TransitionRouter';
import { useOnline, useSWMessage } from '../../hooks';
import { RedirectToFourOFour } from '../Pages/FourOFour/FourOFour';
import { PWAInstallProvider } from './contexts/PWAInstall';
import { QueuedFiles } from './contexts/QueuedFiles';
import FileTransfer from './FileTransfer/FileTransfer';
import JoinInstantRoom from './JoinInstantRoom/JoinInstantRoom';
import NewUser from './NewUser/NewUser';
import Rooms from './Rooms/Rooms';
import Settings from './Settings/Settings';
import Support from './Support/Support';

import './app.scss';

const updateLocalStorageSchema = () => {
  if (typeof window === 'undefined') return;

  const v2Converter = (data) => {
    data.rooms = data.rooms.map((room) =>
      typeof room === 'string'
        ? { name: room, lastJoin: new Date().getTime() }
        : room
    );
  };

  createLocalStorageDispatch('blaze', (data) => {
    v2Converter(data);
    return data;
  })();
};

export default function App() {
  const [isLoaded, setLoaded] = useState(false);
  const isRegistered = useLocalStorageSelector('blaze', (state) => !!state);
  const isOnline = useOnline();
  const [queuedFiles, setQueuedFiles] = useSWMessage(
    [],
    constants.SW_LOAD_FILES
  );

  /* Mount specific effects */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    navigator.serviceWorker?.controller?.postMessage(constants.SW_SHARE_READY);
  }, []);

  /* Loading extra scripts */
  useEffect(() => {
    if (!isRegistered) return;

    const scriptjs = require('scriptjs');

    scriptjs(
      [
        'https://unpkg.com/canvas-elements/build/cdn/canvas-elements.min.js',
        'https://cdn.jsdelivr.net/npm/webtorrent@0.108.6/webtorrent.min.js',
      ],
      () => {
        updateLocalStorageSchema();
        setLoaded(true);
      }
    );
  }, [isRegistered]);

  /* Changing route when offline */
  useEffect(() => {
    if (isRegistered && !isOnline) {
      route('/app', true);
    }
  }, [isRegistered, isOnline]);

  if (!isRegistered) return <NewUser />;

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
          <TransitionRoute key="settings" path="/app/settings">
            <Settings />
          </TransitionRoute>
          <TransitionRoute key="support" path="/app/support">
            <Support />
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
  ) : (
    <Loading fullScreen />
  );
}
