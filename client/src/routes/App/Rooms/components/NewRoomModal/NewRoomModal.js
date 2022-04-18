import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Loader } from 'preact-feather';

import Modal from '../../../../../components/Modal/Modal';
import { useInstantRoom } from '../../../../../hooks';

import './NewRoomModal.scoped.scss';

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
        <h2>Create public room</h2>
        <p class="description">
          Public rooms allow file sharing across any device connected to the internet in the same room.
        </p>
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
          <button type="submit" class="btn wide" disabled={isLoading}>
            Join Room
          </button>
        </form>
        <hr />
        <p class="instant-room-help">
          Instant Rooms are easy to remember room names that don't clash with existing room names.
        </p>
        <button class="btn outlined wide" onClick={getInstantRoom} disabled={isLoading}>
          <Loader size={18} />
          &nbsp;&nbsp;
          { isLoading ? 'Joining' : 'Join Instant Room' }
        </button>
      </div>
    </Modal>
  );
}

export default NewRoomModal;