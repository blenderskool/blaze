import constants from '../../../common/constants';
import { toast } from '../components/Toast';
import pluralize from '../utils/pluralize';

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
        if (fileParts.length) {
          onDone(new Blob(fileParts), metaData.meta[0]);
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

    return () => {
      this.socket.off(constants.FILE_TORRENT);
      this.socket.off(constants.FILE_INIT);
      this.socket.off(constants.CHUNK);
    };
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
      type: file.type,
    }];

    onMeta(meta);
    
    this.socket.send(constants.FILE_INIT, {
      sender: this.socket.name,
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
    if (!input) return;
    
    if (useTorrent) {
      const inputMap = {};
      let totalSize = 0;
      for (let i = 0; i < input.length; i++) {
        const file = input[i];
        inputMap[file.name + file.size] = file;
        totalSize += file.size;
      }

      if (totalSize > TORRENT_SIZE_LIMIT) {
        throw new Error(constants.ERR_LARGE_FILE);
      } else if (totalSize > 7e7) {
        toast(`File${pluralize(input.length, ' is', 's are')} large, transfer may take long time`);
      }

      this.torrentClient.seed(input, trackers, torrent => {
        this._onTorrent({
          torrent,
          onProgress: onTorrentProgress,
          onDone,
        });

        const filesMeta = torrent.files.map(file => ({
          name: file.name,
          size: file.length,
          type: inputMap[file.name + file.length].type,
        }));

        onMeta(filesMeta);
        this.socket.send(constants.FILE_TORRENT, {
          infoHash: torrent.infoHash,
          sender: this.socket.name,
          size: torrent.length,
          meta: filesMeta,
        });

      });
    }
    else {
      input = Array.from(input);

      for(const file of input) {
        if (file.size > WS_SIZE_LIMIT) {
          throw new Error(constants.ERR_LARGE_FILE);
        }
        await this.sendFileSocket({ file, numPeers, onMeta, onSocketProgress });
      }
    }
  }

}

export default FileShare;