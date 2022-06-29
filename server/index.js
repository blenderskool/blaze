import express from 'express';
import http from 'http';
import cors from 'cors';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { URL } from 'url';

import log from './utils/log';
import instantRoom from './instantRoom';
import { wss, rooms } from './sockets';
import Room from '../common/utils/room';

const CORS_ORIGIN = process.env.ORIGIN ? JSON.parse(process.env.ORIGIN) : '*';
const PORT = process.env.PORT || 3030;

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));
app.use('/instant-room', instantRoom);

const server = http.createServer(app);

app.get('/', (_, res) => {
  res.send({
    message: 'Blaze WebSockets running',
    rooms: Object.keys(rooms).length,
    peers: Object.values(rooms).reduce((sum, room) => sum + room.sockets.length, 0),
  });
});


app.get('/local-peers', (req, res) => {
  let ip = req.ip ?? req.connection.remoteAddress;
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  res.writeHead(200, headers);

  const watcher = { id: nanoid(), res };

  if (!rooms[ip]) {
    rooms[ip] = new Room(ip);
  }
  rooms[ip].addWatcher(watcher);

  rooms[ip].informWatchers([ watcher ]);

  req.on('close', () => {
    const room = rooms[ip];
    if (!room) return;

    room.removeWatcher(watcher);

    if (!room.watchers.length && !room.socketsData.length) {
      delete rooms[ip];
    }
  });
});

app.get('/rooms/:roomName/qrcode', async (req, res) => {
  const clientUrl = req.headers.referer;

  try {
    const { origin } = new URL(clientUrl);
    const qrcode = await QRCode.toString(`${origin}/app/t/${req.params.roomName}`, { type: 'svg' });
    res.type('svg');
    res.send(qrcode);
  } catch(e) {
    res.status(400).send('Bad Request');
  }
});

server.on('upgrade', (request, socket, head) => {
  const origin = request.headers.origin;

  let allowed = false;
  if (CORS_ORIGIN === '*') {
    allowed = true;
  } else if (Array.isArray(CORS_ORIGIN)) {
    for(const o of CORS_ORIGIN) {
      if (o === origin) {
        allowed = true;
        break;
      }
    }
  }
  
  if (!allowed) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  } else {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  }
});

server.listen(PORT, () => {
  log(`listening on *:${PORT}`);
});
