import Socket from '../../utils/socket';
import constants from '../../constants';

/**
 * Opens a socket connection to join a room
 * @param {String} room Room to join
 * @param {String} username Name of the user joining the room
 */
function socketConnect(room, username) {
  const socket = new Socket(new WebSocket(`ws://${window.location.host}`));
  
  socket.on('open', () => {
    socket.send(constants.JOIN, {
      roomName: room,
      name: username,
      isWebRTC: true,
    });
  });

  return socket;
}

export default socketConnect;