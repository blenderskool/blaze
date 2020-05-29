const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const Socket = require('../utils/socket');
const log = require('./log');
const constants = require('../constants');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const rooms = {};

class Room {
  constructor(name) {
    this.sockets = [];
    this.sender = null;
    this.name = name;
  }

  addSocket(socket) {
    this.sockets.push(socket);
  }

  removeSocket(socket) {
    this.sockets = this.sockets.filter(client => client.name !== socket.name);
  }

  broadcast(event, message, ignore) {
    this.sockets.forEach(client => {
      if (ignore && ignore.includes(client.name)) return;

      client.send(event, message);
    });
  }

  get socketsData() {
    return this.sockets.map(({ name, isWebRTC }) => ({ name, isWebRTC }));
  }

  getSocketFromName(name) {
    return this.sockets.find(socket => socket.name === name);
  }

  get senderSocket() {
    if (!this.sender) return;

    return this.sockets.find(socket => socket.name === this.sender);
  }
}


wss.on('connection', (ws) => {
  const socket = new Socket(ws);
  let room;
  
  socket.listen(constants.JOIN, (data) => {
    const { roomName, name, isWebRTC } = data;
    socket.name = name;
    socket.isWebRTC = isWebRTC;

    room = rooms[roomName];

    if (room) {
      const user = room.getSocketFromName(socket.name);

      if (user) {
        ws.close(1, "User with same name exists");
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

  socket.on('close', () => {
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
    log(`${socket.name} has initiated file transfer`);

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
});


app.use(express.static('dist'));
app.use('/app(/*)?', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/app.html'));
});
app.use('/sw.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/sw.js'), {
    headers: {
      'Service-Worker-Allow': '/app'
    }
  });
});


const port = process.env.PORT ? process.env.PORT : 3030;
server.listen(port, () => {
  log('listening on *:'+port);
});

if (process.env.NODE_ENV === 'production') {
  // Redirect http to https
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}