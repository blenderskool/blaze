import constants from '../../constants';

const trackers = {
  announce: ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com'],
};

class FileShare {

  constructor(socket) {
    this.socket = socket;
    this.torrentClient = new WebTorrent({
      tracker: {
        ...trackers,
        rtcConfig: {
          iceServers: [
            {
              urls: ['stun:stun.l.google.com:19305', 'stun:stun1.l.google.com:19305']
            }
          ]        
        }
      }
    });
  }

  get isWebRTC() {
    return WebTorrent.WEBRTC_SUPPORT;
  }

  receiveFiles({ onMeta, onProgress, onDone }) {
    let metaData = {};

    this.socket.listen(constants.FILE_TORRENT, ({ infoHash, ...data }) => {
      if (onMeta) {
        metaData = data;
        onMeta(data);
      }

      this.torrentClient.add(infoHash, trackers, torrent => {
        this._onTorrent({ torrent, onProgress, onDone });
      });
    });

    let fileParts = [];
    let size = 0, statProg = 0.25;
    this.socket.listen(constants.FILE_INIT, (data) => {
      if (data.end) {
        // TODO: build the file
        if (fileParts.length) {
          onDone(new Blob(fileParts));
          fileParts = [];
          size = 0;
          statProg = 0.25;
        }
      }
      else {
        metaData = data;
        onMeta(data);
      }
    });

    this.socket.listen(constants.CHUNK, data => {
      fileParts.push(data);
      size += data.byteLength;

      const progress = size / metaData.size;

      onProgress({ progress });

      if (progress >= statProg) {
        statProg += 0.15;
        this.socket.send(constants.FILE_STATUS, {
          progress: statProg,
          peer: this.socket.name,
        });
      }
    });
  }

  _onTorrent({ torrent, onProgress, onDone }) {
    let updateInterval;

    const update = () => {
      onProgress(torrent);

      if (!updateInterval) {
        updateInterval = setInterval(update, 500);
      }

      if (!torrent.uploadSpeed && !torrent.downloadSpeed) {
        onDone();
        torrent.destroy();
        clearInterval(updateInterval);
        updateInterval = undefined;
      }
    }

    torrent.on('upload', update);
    torrent.on('download', update);
    torrent.on('done', () => {
      onDone(torrent.files);
    });
  }

  sendFileSocket({ file, numPeers, onMeta, onSocketProgress }) {
    const reader = file.stream().getReader();
    const transferStatus = {
      peers: Array(numPeers - 1),
      progress: 0.25,
    };
    let sharedSize = 0, progress = 0;

    const meta = [{
      name: file.name,
      size: file.size,
    }];

    onMeta(meta);
    
    this.socket.send(constants.FILE_INIT, {
      user: this.socket.name,
      size: file.size,
      meta,
    });

    return new Promise((resolve) => {

      const stream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          this.socket.off(constants.FILE_STATUS);
          this.socket.send(constants.FILE_INIT, {
            end: true,
          });
          resolve();
          return;
        }

        this.socket.send(constants.CHUNK, value.buffer);
        sharedSize += value.byteLength;
        progress = sharedSize / file.size;

        onSocketProgress({ progress });

        if (transferStatus.peers.length === numPeers - 1 && progress < transferStatus.progress) {
          setTimeout(stream, 1);
        }
      };

      this.socket.listen(constants.FILE_STATUS, ({ peer, progress }) => {
        if (progress !== transferStatus.progress) {
          transferStatus.progress = progress;
          transferStatus.peers = [ peer ];
        } else {
          transferStatus.peers.push(peer);
        }
        
        stream();
      });

      stream();
    });
  }

  async sendFiles({ numPeers, input, useTorrent, onMeta, onSocketProgress, onTorrentProgress, onDone }) {
    if (useTorrent) {
      this.torrentClient.seed(input, trackers, torrent => {
        this._onTorrent({
          torrent,
          onProgress: onTorrentProgress,
          onDone,
        });

        const filesMeta = torrent.files.map(file => ({
          name: file.name,
          size: file.length,
        }));

        onMeta(filesMeta);
        this.socket.send(constants.FILE_TORRENT, {
          infoHash: torrent.infoHash,
          user: this.socket.name,
          size: torrent.length,
          meta: filesMeta,
        });

      });
    }
    else {
      if (!input) return;
      input = input && (input.length ? [...input] : [ input ]);

      for(const file of input) {
        await this.sendFileSocket({ file, numPeers, onMeta, onSocketProgress });
      }

    }
  }

}

export default FileShare;