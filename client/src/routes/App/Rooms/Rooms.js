import { h } from 'preact';
import { memo } from 'preact/compat';
import { route } from 'preact-router';
import { useState, useContext, useEffect, useCallback } from 'preact/hooks';
import { Plus, HelpCircle, X } from 'preact-feather';
import { formatDistance } from 'date-fns';
import { useLocalStorageSelector } from 'react-localstorage-hooks';

import { QueuedFiles } from '../contexts/QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import pluralize from '../../../utils/pluralize';
import urls from '../../../utils/urls';
import AppLanding from '../layouts/AppLanding/AppLanding';
import NewRoomModal from './components/NewRoomModal/NewRoomModal';
import LocalRoomHelpModal from './components/LocalRoomHelpModal/LocalRoomHelpModal';
import { RoomContainer, RoomSecondaryAction, RoomDescription, RoomName, RoomPeers } from './components/Room/Room';
import roomsDispatch from '../../../reducers/rooms';

import './Rooms.scoped.scss';

const RoomsList = memo(function RoomsList({ isOnline, onRoomJoin }) {
  const rooms = useLocalStorageSelector('blaze', ({ rooms }) => rooms, { equalityFn: (prev, next) => prev.length === next.length});
  const { queuedFiles } = useContext(QueuedFiles);
  const [localPeers, setLocalPeers] = useState([]);
  const [showLocalRoomModal, setShowLocalRoomModal] = useState(false);

  useEffect(() => {
    if (!isOnline) return;

    const handlePeersStream = ({ data }) => {
      setLocalPeers(JSON.parse(data));
    };
    const localPeersSource = new EventSource(`${urls.SERVER_HOST}/local-peers`);
    localPeersSource.addEventListener('message', handlePeersStream);

    return () => {
      localPeersSource.removeEventListener('message', handlePeersStream);
      localPeersSource.close();
    };
  }, [isOnline]);

  if (!isOnline) {
    return <div class="message">Connect to the internet to start sharing files</div>;
  } else {
    return (
      <>
        {
          !!queuedFiles.length && (
            <div class="message" style="margin-top: 0; margin-bottom: 2.5rem;">
              Join a room to share the selected
              {' '}
              {pluralize(queuedFiles.length, 'file', 'files')}
            </div>
          )
        }
        <ul class="recent-rooms-list">
          {/* Local room */}
          <RoomContainer highlighted={localPeers.length > 0} as="li" role="link" tabIndex="0" onClick={() => onRoomJoin('')}>
            <div>
              <RoomName>Local network room</RoomName>
              <RoomDescription>Share files only on your local network</RoomDescription>
            </div>
            {
              localPeers.length > 0 ? 
                <RoomPeers localPeers={localPeers} /> : (
                <RoomSecondaryAction onClick={() => setShowLocalRoomModal(true)} ariaLabel="What is local network room?">
                  <HelpCircle />
                </RoomSecondaryAction>
              )
            }
          </RoomContainer>
          {
            rooms.map((room, idx) => (
              <RoomContainer key={idx} as="li" role="link" tabIndex="0" onClick={() => onRoomJoin(room.name)}>
                <div>
                  <RoomName>{room.name}</RoomName>
                  <RoomDescription>
                    Joined
                    {' '}
                    {formatDistance(new Date(room.lastJoin), new Date(), { addSuffix: true })}
                  </RoomDescription>
                </div>
                <RoomSecondaryAction
                  onClick={() => roomsDispatch({ type: 'remove-room', payload: idx })}
                  ariaLabel="Remove room"
                >
                  <X />
                </RoomSecondaryAction>
              </RoomContainer>
            ))
          }
        </ul>

        <LocalRoomHelpModal
          isOpen={showLocalRoomModal}
          onClose={() => setShowLocalRoomModal(false)}
          onRoomJoin={onRoomJoin}
        />
      </>
    );
  }
});

function Rooms({ isOnline }) {
  const [isModalOpen, setModal] = useState(false);
  const username = useLocalStorageSelector('blaze', ({ user }) => user.name);

  const handleNewRoom = useCallback((room) => {
    setModal(false);
    const roomURL = room.replace(/ /g, '-').toLowerCase();
    route(`/app/t/${roomURL}`);
  }, [setModal]);

  useEffect(() => {
    document.title = 'App | Blaze';
  }, []);

  return (
    <AppLanding title={`Hi, ${username}`} subtitle="Join or create a room to share files">
      <main class="rooms">
        <section class="recent-rooms">
          <h2 class="section-title">Recent Rooms</h2>

          <RoomsList isOnline={isOnline} onRoomJoin={handleNewRoom} />

          {isOnline && (
            <Fab className="fab-new-room" text="New Room" onClick={() => setModal(true)}>
              <Plus />
            </Fab>
          )}
        </section>

        <NewRoomModal isOpen={isModalOpen} onNewRoom={handleNewRoom} onClose={() => setModal(false)} />
      </main>
    </AppLanding>
  );
}

export default Rooms;