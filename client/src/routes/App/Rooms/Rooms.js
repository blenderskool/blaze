import { h } from 'preact';
import { route } from 'preact-router';
import { useState, useContext, useEffect } from 'preact/hooks';
import { Plus } from 'preact-feather';

import { QueuedFiles } from '../contexts/QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import pluralize from '../../../utils/pluralize';
import { useLocalStorageSelector } from '../../../hooks';
import AppLanding from '../layouts/AppLanding/AppLanding';
import NewRoomModal from './components/NewRoomModal/NewRoomModal';

import './Rooms.scoped.scss';
import { RoomContainer, RoomDeleteButton, RoomDescription, RoomName } from './components/Room/Room';

function Rooms({ isOnline }) {
  const [isModalOpen, setModal] = useState(false);
  const username = useLocalStorageSelector('blaze', ({ user }) => user.name);
  let data = JSON.parse(localStorage.getItem('blaze'));
  const [rooms, setRooms] = useState(data.rooms);
  const { queuedFiles } = useContext(QueuedFiles);

  const handleNewRoom = (room) => {
    setModal(false);
    const roomURL = room.replace(/ /g, '-').toLowerCase();
    route(`/app/t/${roomURL}`);
  };

  const removeRoom = (room) => {
    const newRooms = rooms.filter(roomName => roomName !== room);
    setRooms(newRooms);

    data = {
      ...data,
      rooms: newRooms,
    };

    localStorage.setItem('blaze', JSON.stringify(data));
  };

  useEffect(() => {
    document.title = 'App | Blaze';
    
    if (rooms.length === 0) {
      setModal(true);
    }
  }, [setModal]);

  let RoomsList = null;

  if (!isOnline) {
    RoomsList = <div class="message">Connect to the internet to start sharing files</div>;
  } else if (!rooms.length) {
    RoomsList = (
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
    RoomsList = (
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
            rooms.map((room) => (
              <RoomContainer as="li" role="link" tabIndex="0" onClick={() => handleNewRoom(room)}>
                <div>
                  <RoomName>{room}</RoomName>
                  <RoomDescription>Last joined sometime ago</RoomDescription>
                </div>
                <RoomDeleteButton
                  onClick={e => {
                    e.stopPropagation();
                    removeRoom(room);
                  }}
                />
              </RoomContainer>
            ))
          }
        </ul>
      </>
    );
  }

  return (
    <AppLanding title={`Hi, ${username}`} subtitle="Let’s share some files">
      <main class="rooms">
        <section class="recent-rooms">
          <h2 class="section-title">Recent Rooms</h2>

          {RoomsList}

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