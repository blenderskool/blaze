import { h } from 'preact';
import { route } from 'preact-router';
import { useState, useContext, useEffect } from 'preact/hooks';
import { HelpCircle, Loader, Plus, X } from 'preact-feather';

import { QueuedFiles } from '../QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import Modal from '../../../components/Modal/Modal';
import pluralize from '../../../utils/pluralize';
import useInstantRoom from '../../../hooks/useInstantRoom';

import './Rooms.scss';
import urls from '../../../utils/urls';

function NewRoomModal({ onNewRoom, ...props }) {
  const [room, setRoom] = useState();
  const [getInstantRoom, { loading: isLoading }] = useInstantRoom((room) => {
    onNewRoom(room);
  });

  const handleSubmit = e => {
    e.preventDefault();
    onNewRoom(room);
  };

  const handleRoomInputChange = e => {
    e.target.setCustomValidity('');
    setRoom(e.target.value);
  };

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
            onInvalid={e => { e.target.setCustomValidity('Room names can contain only letters and numbers'); }}
            onChange={handleRoomInputChange}
            disabled={isLoading}
          />
          <button type="submit" class="wide" disabled={isLoading}>
            Join Room
          </button>
        </form>
        <hr />
        <button class="outlined wide" onClick={getInstantRoom} disabled={isLoading}>
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

function LocalRoomHelpModal({ onNewRoom, ...props}) {
  return (
    <Modal {...props}>
      <div class="local-room-help">
        <h2>Local Network room</h2>
        <p>
          Local network room creates a private and isolated room among devices in the same network connection.
          Devices outside the local network cannot join this room.
          <br />
          <br />
          If Blaze is unable to detect devices in your local network, you can still create standard file sharing room
          that allows any device from any network to join the room.
        </p>
        <button class="wide" onClick={() => onNewRoom('')}>
          Join local room
        </button>
      </div>
    </Modal>
  );
}


function Rooms({ isOnline }) {
  const [isModalOpen, setModal] = useState(false);
  const [isLocalRoomHelpOpen, setLocalRoomHelpOpen] = useState(false);
  let data = JSON.parse(localStorage.getItem('blaze'));
  const [rooms, setRooms] = useState(data.rooms);
  const [localPeers, setLocalPeers] = useState([]);
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
  }, []);

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
                !!queuedFiles.length && (
                  <div class="message" style="margin-top: 0; margin-bottom: 2.5rem;">
                    Join a room to share the selected
                    {' '}
                    {pluralize(queuedFiles.length, 'file', 'files')}
                  </div>
                )
              }
              <ul class="recent-rooms">
                <li class={`room-local ${localPeers.length ? 'active' : ''}`} role="link" tabIndex="0" onClick={() => handleNewRoom('')}>
                  <div class="name">Local network room</div>
                  <button
                    class="thin icon room-action"
                    aria-label="Know more"
                    onClick={e => {
                      e.stopPropagation();
                      setLocalRoomHelpOpen(true);
                    }}
                  >
                    <HelpCircle />
                  </button>
                  {
                    localPeers.length > 0 && (
                      <ul class="peers">
                        {localPeers.slice(0, 3).map((peer) => <li class="peer" title={peer.name}>{peer.name[0]}</li>)}
                        {localPeers.length > 3 && (
                          <li class="extra">
                            +
                            {localPeers.length - 3}
                          </li>
                        )}
                      </ul>
                    )
                  }
                </li>
                {
                  rooms.map(room => (
                    <li class="room" role="link" tabIndex="0" onClick={() => handleNewRoom(room)}>
                      <div class="name">{room}</div>
                      <button
                        class="thin icon room-action"
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
              {
                rooms.length === 0 && (
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

              <div class="donate">
                Like using Blaze? Consider
                <a href="https://www.buymeacoffee.com/akashhamirwasia"> donating</a>
              </div>

              <Fab text="New Room" onClick={() => setModal(true)}>
                <Plus />
              </Fab>
            </>
          ) : <div class="message" style="margin-top: 5rem">Connect to the internet to start sharing files</div>
        }
      </main>

      <NewRoomModal isOpen={isModalOpen} onNewRoom={handleNewRoom} onClose={() => setModal(false)} />
      <LocalRoomHelpModal isOpen={isLocalRoomHelpOpen} onNewRoom={handleNewRoom} onClose={() => setLocalRoomHelpOpen(false)} />
    </div>
  );
}

export default Rooms;