import { rooms } from '../../server/sockets';
import log from '../../server/utils/log';
import constants from '../constants';

class Room {
  constructor(name) {
    this.sockets = [];
    this.watchers = [];
    this.sender = null;
    this.name = name;
  }

  addSocket(socket) {
    this.sockets.push(socket);
    this.informWatchers();
  }

  addWatcher(watcher) {
    this.watchers.push(watcher);
  }

  removeSocket(socket) {
    const totalSockets = this.sockets.length;
    this.sockets = this.sockets.filter(client => client.name !== socket.name);
    const totalSocketsAfterRemove = this.sockets.length;

    // Requested socket for deletion was not there, hence rest of the operation is terminated
    if (totalSockets === totalSocketsAfterRemove) return;
    
    log(`${socket.name} has left ${this.name}`);
    this.informWatchers();

    if (this.sockets.length) {
      this.broadcast(constants.USER_LEAVE, socket.name, [ socket.name ]);
    } else if (!this.watchers.length) {
      delete rooms[this.name];
    }
  }

  removeWatcher(watcher) {
    this.watchers = this.watchers.filter(({ id }) => id !== watcher.id);
    watcher.res.end();
  }

  broadcast(event, message, ignore) {
    this.sockets.forEach(client => {
      if (ignore && ignore.includes(client.name)) return;

      client.send(event, message);
    });
  }

  informWatchers(watchers = this.watchers) {
    watchers.forEach(({ res }) => {
      res.write(`data: ${JSON.stringify(this.socketsData)}\n\n`);
    });
  }

  get socketsData() {
    return this.sockets.map(({ name, peerId }) => ({ name, peerId }));
  }

  getSocketFromName(name) {
    return this.sockets.find(socket => socket.name === name);
  }

  get senderSocket() {
    if (!this.sender) return undefined;

    return this.sockets.find(socket => socket.name === this.sender);
  }
}

export default Room;