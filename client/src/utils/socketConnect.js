import Socket from '../../../common/utils/socket';
import constants from '../../../common/constants';
import FileShare from './fileShare';

function getSocketURL() {
  if (WS_HOST) return WS_HOST;

  if (window.location.protocol === 'https:') {
    return `wss://${window.location.host}/ws`;
  } else {
    return `ws://${window.location.host}/ws`;
  }
}

/**
 * Opens a socket connection to join a room
 * @param {String} room Room to join
 * @param {String} username Name of the user joining the room
 */
function socketConnect(room, username) {
  const socket = new Socket(new WebSocket(getSocketURL()));
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