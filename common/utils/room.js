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