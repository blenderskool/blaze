import Socket from '../../utils/socket';
import constants from '../../constants';
import FileShare from './fileShare';

/**
 * Opens a socket connection to join a room
 * @param {String} room Room to join
 * @param {String} username Name of the user joining the room
 */
function socketConnect(room, username) {
  const socket = new Socket(new WebSocket(WS_HOST));
  const fileShare = new FileShare(socket);
  socket.name = username;
  
  socket.on('open', () => {
    socket.send(constants.JOIN, {
      roomName: room,
      name: username,
      peerId: fileShare.isWebRTC ? fileShare.torrentClient.peerId : null,
    });
  });

  return fileShare;
}

export default socketConnect;