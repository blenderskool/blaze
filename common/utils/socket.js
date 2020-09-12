class Socket {

  constructor(socket) {
    this.socket = socket;
    this.socket.binaryType = 'arraybuffer';
    this.callbacks = {};
    this.peerId = '';

    socket.addEventListener('message', msg => {
      let callback, data;
      if (typeof msg.data === 'string') {
        const json = JSON.parse(msg.data);
        data = json.data;
        callback = this.callbacks[json.event];
      }
      else {
        callback = this.callbacks['chunk'];
        data = msg.data;
      }

      if (callback) {
        callback(data);
      }
    });
  }

  listen(event, callback) {
    this.callbacks[event] = callback;
  }

  on(event, callback) {
    this.socket.addEventListener(event, callback);
  }

  off(event) {
    this.callbacks[event] = undefined;
  }

  send(event, data) {
    if (event === 'chunk') {
      this.socket.send(data);
    }
    else {
      this.socket.send(JSON.stringify({ event, data }));
    }
  }

  close(code, reason) {
    this.socket.close(code, reason);
  }

  get id() {
    return this.socket.id;
  }
}

export default Socket;