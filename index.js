const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const p2p = require('socket.io-p2p-server').Server;


/**
 * A custom log function that also prints the time
 * @param {String} message Message to be logged
 */
function log(message) {
  if (process.env.NODE_ENV === 'production') return;

  const date = new Date();
  console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`);
}


/**
 * Sends a list of connected users to a specific room
 * @param {String} room Name of the room to emit the list
 */
function emitUsrsList(room) {
  const roomData = io.sockets.adapter.rooms[room];
  if (!roomData) return;

  const sockets = io.sockets.adapter.rooms[room].sockets;
  io.to(room).emit('userJoin', Object.keys(sockets).map(socketID => io.sockets.connected[socketID].username));
}

app.use(express.static('dist'));
app.use('/app(/*)?', (req, res) => {
  res.sendFile(__dirname + '/dist/app.html');
});
app.use('/sw.js', (req, res) => {
  res.sendFile(__dirname + '/dist/sw.js', {
    headers: {
      'Service-Worker-Allow': '/app'
    }
  });
});


const clients = {};


/**
 * Check if the user is already present in the room.
 * If the user is present, then don't allow user with same name in the room.
 */
io.use((socket, next) => {

  const query = socket.handshake.query;

  if (clients[query.room] && clients[query.room].users[query.user]) {
    next(new Error('A user with same nickname exists in this room'));
  } else {
    next();
  }

});


io.use(p2p);

io.on('connection', socket => {

  const query = socket.handshake.query;
  const room = query.room;
  const user = query.user;

  /**
   * Add the instance of the room
   */
  if (!clients[room]) {
    clients[room] = { users: {} };
  }
  clients[room].users[user] = socket.id;

  
  log(`${user} has joined ${room} room`);
  socket = socket.join(room);
  socket.username = user;

  socket.on('disconnect', () => {

    delete clients[room].users[user];

    socket.to(room).emit('userLeft', user)
  });

  emitUsrsList(room);

  socket.on('file', data => socket.broadcast.emit('file', data));
  socket.on('rec-status', data => {
    const sID = clients[room].users[data.sender];
    io.sockets.connected[sID].emit('rec-status', data);
  });
  socket.on('file-data', data => socket.broadcast.emit('file-data', data));

});

const port = process.env.PORT ? process.env.PORT : 3030;
http.listen(port, () => {
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