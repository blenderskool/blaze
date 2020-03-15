/**
 * Opens a socket connection to join a room
 * @param {String} room Room to join
 * @param {String} username Name of the user joining the room
 */
function socketConnect(room, username) {
  return io('//'+window.location.host, {
    query: `room=${room}&user=${username}`,
  });
}

export default socketConnect;