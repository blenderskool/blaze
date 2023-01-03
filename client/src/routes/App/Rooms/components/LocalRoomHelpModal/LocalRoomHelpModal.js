import { h } from 'preact';
import PropTypes from 'prop-types';

import Modal from '../../../../../components/Modal/Modal';
import './LocalRoomHelpModal.scoped.scss';

function LocalRoomHelpModal({ onRoomJoin, ...props }) {
  return (
    <Modal {...props}>
      <div class="local-room-help">
        <h2>Local Network room</h2>
        <p>
          Local network room creates a private and isolated room among devices
          in the same network connection sharing the same public IP address.
          Devices outside the local network cannot join this room.
          <br />
          <br />
          If Blaze is unable to detect devices in your local network, you can
          still create a public file sharing room that allows any device
          connected to the internet to join the room and share files.
        </p>
        <button class="btn wide" onClick={() => onRoomJoin('')}>
          Join local room
        </button>
      </div>
    </Modal>
  );
}

LocalRoomHelpModal.propTypes = {
  onRoomJoin: PropTypes.func.isRequired,
};

export default LocalRoomHelpModal;
