import express from 'express';
import roomGenerator from 'project-name-generator';

import { rooms } from './sockets';

const router = express.Router();

function getInstantRoom() {
  let room;

  do {
    room = roomGenerator({ number: true }).dashed;
  } while(room in rooms);

  return room;
}

router.get('/', (_, res) => {
  res.send({
    room: getInstantRoom(),
  });
});

export default router;
