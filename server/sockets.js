import WebSocket from 'ws';

import log from './utils/log';
import Socket from '../common/utils/socket';
import Room from '../common/utils/room';
import constants from '../common/constants';
import getIp from './utils/get-ip';

const WS_SIZE_LIMIT = process.env.WS_SIZE_LIMIT || 1e8;
const SOCKET_ALIVE_PONG_TIMEOUT = 5 * 1000; // 5 seconds
const RECHECK_ALIVE_SOCKETS_INTERVAL = 30 * 1000; // 30 seconds

const wss = new WebSocket.Server({ noServer: true });
const rooms = {};

/**
 * Checks if a user's socket is active by sending a PING and
 * anticipating a PONG response within SOCKET_ALIVE_PONG_TIMEOUT
 * seconds from the user.
 *
 * @param {string} room Room name
 * @param {Socket} user User socket to check if it is active
 * @returns {Promise} Promise that resolves if user is active otherwise rejects
 */
const isUserAlive = (room, user) =>
  new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      timeoutId = null;
      room.removeSocket(user);
      reject();
    }, SOCKET_ALIVE_PONG_TIMEOUT);

    user.socket.on('pong', () => {
      if (timeoutId === null) return;

      clearTimeout(timeoutId);
      resolve();
    });

    log(
      `Checking if ${user.name} is alive. Someone with same name is trying to join`
    );
    user.socket.ping();
  });

wss.on('connection', (ws, request) => {
  ws.isAlive = true;

  const ip = getIp(request);

  const socket = new Socket(ws, ip);
  let room;

  socket.listen(constants.JOIN, async (data) => {
    let { roomName, name, peerId } = data;
    socket.name = name;
    socket.peerId = peerId;
    roomName = roomName || socket.ip;

    room = rooms[roomName];

    if (room) {
      // 1. Check if there's some user with same name in the room
      const user = room.getSocketFromName(socket.name);
      if (user) {
        try {
          // 2. If a user with same exists, check if they are still active
          await isUserAlive(room, user);
          // 3. If they are active, close the connection of user trying to join
          socket.close(1000, constants.ERR_SAME_NAME);
          return;
        } catch {
          // 4. If the user is not active, they are removed from the room
          // Now the user trying to join is let in
        }
      }
    }

    /**
     * 5. Check if the room still exists, as after removing any potential inactive users
     *    with same name might have caused the room to become empty and hence deleted
     */
    room = rooms[roomName];
    if (!room) {
      // 6. Create room if it does not exist
      rooms[roomName] = new Room(roomName);
      room = rooms[roomName];
    }

    // 7. Add the user to the room
    log(`${name} has joined ${roomName}`);

    room.addSocket(socket);
    room.broadcast(constants.USER_JOIN, room.socketsData);
  });

  socket.on('close', (data) => {
    if (data.reason === constants.ERR_SAME_NAME) return;
    if (!room) return;

    room.removeSocket(socket);
  });

  socket.on('pong', () => {
    socket.socket.isAlive = true;
  });

  socket.listen(constants.FILE_INIT, (data) => {
    // TODO: Prevent init from multiple sockets if a sender is already there
    // TODO: Improve error messaging via sockets
    if (data.size > WS_SIZE_LIMIT) return;

    if (data.end) {
      log(`File transfer just finished!`);
    } else {
      log(`${socket.name} has initiated file transfer`);
    }

    room.sender = socket.name;
    room.broadcast(constants.FILE_INIT, data, [socket.name]);
  });

  socket.listen(constants.FILE_STATUS, (data) => {
    const sender = room.senderSocket;
    // TODO: Sender is not there but some file is getting transferred!
    if (!sender) return;

    sender.send(constants.FILE_STATUS, data);
  });

  socket.listen(constants.CHUNK, (data) => {
    room.broadcast(constants.CHUNK, data, [room.sender]);
  });

  socket.listen(constants.FILE_TORRENT, (data) => {
    room.broadcast(constants.FILE_TORRENT, data, [socket.name]);
  });
});

const interval = setInterval(() => {
  log('Checking alive sockets');
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, RECHECK_ALIVE_SOCKETS_INTERVAL);

wss.on('close', () => {
  clearInterval(interval);
});

export { wss, rooms };
