import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import Socket from '../utils/socket';
import Room from '../utils/room';
import log from './log';
import constants from '../constants';

const CORS_ORIGIN = process.env.ORIGIN || '*';
const PORT = process.env.PORT || 3030;
const WS_SIZE_LIMIT = process.env.WS_SIZE_LIMIT || 1e8;

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const rooms = {};

wss.on('connection', (ws) => {
  const socket = new Socket(ws);
  let room;
  
  socket.listen(constants.JOIN, (data) => {
    const { roomName, name, peerId } = data;
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
      } else {
        delete rooms[room.name];
      }
    }
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

app.get('/', (req, res) => {
  res.send({
    message: 'Blaze WebSockets running',
    rooms: Object.keys(rooms).length,
    peers: Object.values(rooms).reduce((sum, room) => sum + room.sockets.length, 0),
  });
});

server.listen(PORT, '0.0.0.0', () => {
  log(`listening on *:${PORT}`);
});