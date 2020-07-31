import WebSocket from 'ws';

import log from './utils/log';
import Socket from '../common/utils/socket';
import Room from '../common/utils/room';
import constants from '../common/constants';

const WS_SIZE_LIMIT = process.env.WS_SIZE_LIMIT || 1e8;

const wss = new WebSocket.Server({ noServer: true });
const rooms = {};

wss.on('connection', (ws) => {
  ws.isAlive = true;
  const ip = request.connection.remoteAddress;
  const socket = new Socket(ws, ip);
  let room;
  
  socket.listen(constants.JOIN, (data) => {
    const { roomName = socket.ip, name, peerId } = data;
    socket.name = name;
    socket.peerId = peerId;

    room = rooms[roomName];

    if (room) {
      const user = room.getSocketFromName(socket.name);
      if (user) {
        socket.close(1000, constants.ERR_SAME_NAME);
        return;
      }
    }
    else {
      rooms[roomName] = new Room(roomName);
      room = rooms[roomName];
    }

    log(`${name} has joined ${roomName}`);

    room.addSocket(socket);
    room.broadcast(constants.USER_JOIN, room.socketsData);
  });

  socket.on('close', data => {
    if (data.reason === constants.ERR_SAME_NAME) return;
    if (!room) return;

    log(`${socket.name} has left ${room.name}`);
    room.removeSocket(socket);
    const sockets = room.socketsData;

    if (Array.isArray(sockets)) {
      if (sockets.length) {
        room.broadcast(constants.USER_LEAVE, socket.name, [ socket.name ]);
      } else if (!room.watchers.length) {
        delete rooms[room.name];
      }
    }
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
    room.broadcast(constants.FILE_INIT, data, [ socket.name ]);
  });

  socket.listen(constants.FILE_STATUS, (data) => {
    const sender = room.senderSocket;
    // TODO: Sender is not there but some file is getting transferred!
    if (!sender) return;

    sender.send(constants.FILE_STATUS, data);
  });

  socket.listen(constants.CHUNK, (data) => {
    room.broadcast(constants.CHUNK, data, [ room.sender ]);
  });

  socket.listen(constants.FILE_TORRENT, (data) => {
    room.broadcast(constants.FILE_TORRENT, data, [ socket.name ]);
  });
});

const interval = setInterval(() => {
  log("Checking alive sockets");
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

export { wss, rooms };
