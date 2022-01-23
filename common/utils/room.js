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
    this.sockets = this.sockets.filter(client => client.name !== socket.name);
    this.informWatchers();
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