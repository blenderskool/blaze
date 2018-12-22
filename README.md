# Blaze - A file sharing web app

Blaze is a file sharing web app that uses WebSockets and WebRTC to transfer files between multiple devices.
It currently uses `socket.io` to make real time connections on `express` backend. The frontend is built on vanilla JavaScript.
The current method of sharing files involves using base64 encoded format to transfer files. This may change to increase the efficiency of file transfer.


## Development
```
git clone https://github.com/blenderskool/blaze
cd blaze
npm install
npm run dev
```

## Building for production
```
npm run build
```