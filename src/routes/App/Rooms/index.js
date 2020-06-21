import { h, Component } from 'preact';
import { route } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';

import Fab from '../../../components/Fab';
import Modal from '../../../components/Modal';


function NewRoomModal({ onNewRoom, ...props }) {
  const [room, setRoom] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    onNewRoom(room);
  };

  return (
    <Modal {...props}>
      <form class="join-room" onSubmit={handleSubmit}>
        <input
          type="text"
          maxlength="10"
          required
          placeholder="Room name"
          pattern="[A-Za-z0-9]+"
          style="margin-top: 0"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button type="submit" class="wide">
          Join Room
        </button>
      </form>
    </Modal>
  );
}


function Rooms() {
  const [isModalOpen, setModal] = useState(false);
  const [isOnline, setOnline] = useState(navigator.onLine);
  let data = JSON.parse(localStorage.getItem('blaze'));
  const [rooms, setRooms] = useState(data.rooms);

  const onOnline = () => {
    setOnline(navigator.onLine);
  };

  const handleNewRoom = (room) => {
    setModal(false);
    route(`/app/t/${room.toLowerCase()}`);
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
    window.addEventListener('online', onOnline);

    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
    <>
      <header>
        <h1 class="title">Recent Rooms</h1>
      </header>

      <main>
        {
          isOnline ? (
            <>
              <ul class="recent-rooms">
                {
                  rooms.map(room => (
                    <li role="link" tabIndex="0" onClick={() => route(`/app/t/${room}`)}>
                      <div>{room}</div>
                      <button
                        class="thin icon icon-cancel"
                        aria-label="Remove room"
                        onClick={e => {
                          e.stopPropagation();
                          removeRoom(room);
                        }}
                      />
                    </li>
                  ))
                }
              </ul>
              <Fab icon="icon-add" onClick={() => setModal(true)}>
                New Room
              </Fab>
            </>
          ) : <div class="message">Connect to the internet to start sharing files</div>
        }
      </main>

      <NewRoomModal
        isOpen={isModalOpen}
        onNewRoom={handleNewRoom}
        onClose={() => setModal(false)}
      />
    </>
  );
}

export default Rooms;