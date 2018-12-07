const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const p2p = require('socket.io-p2p-server').Server;

io.use(p2p);

/**
 * A custom log function that also prints the time
 * @param {String} message Message to be logged
 */
function log(message) {
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

app.use(express.static('client'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', socket => {

  const query = socket.handshake.query;
  const room = query.room;
  const user = query.user;

  
  log(`${user} has joined ${room} room`);
  socket = socket.join(room);
  socket.username = user;

  io.in(room).emit('message', {
    message: `${user} has joined`,
    isServer: true
  });

  socket.on('disconnect', () => socket.to(room).emit('userLeft', user));

  emitUsrsList(room);


  socket.on('file', data => socket.broadcast.emit('file', data));


  socket.on('go-private', data => {
    socket.broadcast.emit('go-private', data)
  });

});

const port = process.env.PORT ? process.env.PORT : 3030;
http.listen(port, () => {
  log('listening on *:'+port);
});