import { h } from 'preact';
import { memo } from 'preact/compat';
import { route } from 'preact-router';
import { useState, useContext, useEffect, useCallback } from 'preact/hooks';
import { Plus } from 'preact-feather';
import { formatDistance } from 'date-fns';
import { createLocalStorageDispatch, useLocalStorageSelector } from 'react-localstorage-hooks';

import { QueuedFiles } from '../contexts/QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import pluralize from '../../../utils/pluralize';
import AppLanding from '../layouts/AppLanding/AppLanding';
import NewRoomModal from './components/NewRoomModal/NewRoomModal';
import { RoomContainer, RoomDeleteButton, RoomDescription, RoomName } from './components/Room/Room';
import roomsReducer from '../../../reducers/rooms';

import './Rooms.scoped.scss';

const dispatch = createLocalStorageDispatch('blaze', roomsReducer);

const RoomsList = memo(function RoomsList({ isOnline, onRoomJoin }) {
  const rooms = useLocalStorageSelector('blaze', ({ rooms }) => rooms, { equalityFn: (prev, next) => prev.length === next.length});
  const { queuedFiles } = useContext(QueuedFiles);

  if (!isOnline) {
    return <div class="message">Connect to the internet to start sharing files</div>;
  } else if (!rooms.length) {
    return (
      <div class="message">
        {
          queuedFiles.length ?
            `Create a room using + button to share the selected ${pluralize(queuedFiles.length, 'file', 'files')}` :
            'Start by joining a room using the + button'
        }
        <p class="devices-same-room">
          Devices must join same room to share files with each other
        </p>
      </div>
    );
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
                <RoomDeleteButton
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({ type: 'remove-room', payload: idx })
                  }}
                />
              </RoomContainer>
            ))
          }
        </ul>
      </>
    );
  }
});

function Rooms({ isOnline }) {
  const [isModalOpen, setModal] = useState(false);
  const username = useLocalStorageSelector('blaze', ({ user }) => user.name);
  const numOfRooms = useLocalStorageSelector('blaze', ({ rooms }) => rooms?.length ?? 0);

  const handleNewRoom = useCallback((room) => {
    setModal(false);
    const roomURL = room.replace(/ /g, '-').toLowerCase();
    route(`/app/t/${roomURL}`);
  }, [setModal]);

  useEffect(() => {
    document.title = 'App | Blaze';
    
    if (numOfRooms === 0) {
      setModal(true);
    }
  }, [setModal]);

  return (
    <AppLanding title={`Hi, ${username}`} subtitle="Let’s share some files">
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