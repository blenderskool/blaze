import { h } from 'preact';
import { route } from 'preact-router';
import { useState, useContext, useEffect } from 'preact/hooks';
import { Loader, Plus, X } from 'preact-feather';

import { QueuedFiles } from '../QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import Modal from '../../../components/Modal/Modal';
import pluralize from '../../../utils/pluralize';
import urls from '../../../utils/urls';

import './Rooms.scss';

function NewRoomModal({ onNewRoom, ...props }) {
  const [isLoading, setLoading] = useState(false);
  const [room, setRoom] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    onNewRoom(room);
  };

  const joinAnonymous = async (e) => {
    setLoading(true);

    try {
      const res = await fetch(`${urls.SERVER_HOST}/anonymous-room`);
      const { room } = await res.json();

      onNewRoom(room);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal {...props}>
      <div class="join-room">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxlength="20"
            required
            placeholder="Room name"
            pattern="^([A-Za-z0-9]+ ?)+[A-Za-z0-9]$"
            style="margin-top: 0"
            value={room}
            onChange={e => setRoom(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" class="wide" disabled={isLoading}>
            Join Room
          </button>
        </form>
        <hr />
        <button class="outlined wide" onClick={joinAnonymous} disabled={isLoading}>
          <Loader size={18} />
          &nbsp;&nbsp;
          { isLoading ? 'Joining' : 'Join an Instant Room' }
        </button>
        <p class="instant-room-help">
          Tip: Instant Rooms are created just for you!
        </p>
      </div>
    </Modal>
  );
}


function Rooms({ isOnline }) {
  const [isModalOpen, setModal] = useState(false);
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

  return (
    <div class="rooms">
      <header class="app-header">
        <h1 class="title">Recent Rooms</h1>
      </header>

      <main>
        {
          isOnline ? (
            <>
              {
                rooms.length ? (
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
                    <ul class="recent-rooms">
                      {
                        rooms.map(room => (
                          <li role="link" tabIndex="0" onClick={() => handleNewRoom(room)}>
                            <div>{room}</div>
                            <button
                              class="thin icon remove-room"
                              aria-label="Remove room"
                              onClick={e => {
                                e.stopPropagation();
                                removeRoom(room);
                              }}
                            >
                              <X />
                            </button>
                          </li>
                        ))
                      }
                    </ul>
                  </>
                ) : (
                  <>
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
                  </>
                )
              }
              <Fab text="New Room" onClick={() => setModal(true)}>
                <Plus />
              </Fab>
            </>
          ) : <div class="message">Connect to the internet to start sharing files</div>
        }
      </main>

      <NewRoomModal isOpen={isModalOpen} onNewRoom={handleNewRoom} onClose={() => setModal(false)} />
    </div>
  );
}

export default Rooms;