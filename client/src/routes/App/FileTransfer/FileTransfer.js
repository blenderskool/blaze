import { h, createRef } from 'preact';
import download from 'downloadjs';
import { route } from 'preact-router';
import { PureComponent, forwardRef, memo } from 'preact/compat';
import { ArrowLeft, CheckCircle, Plus, Image, Film, Box, Music, File, Zap, Share2, Send } from 'preact-feather';
import copy from 'copy-to-clipboard';

import { withQueuedFiles } from '../contexts/QueuedFiles';
import Fab from '../../../components/Fab/Fab';
import Modal from '../../../components/Modal/Modal';
import FileDrop from '../../../components/FileDrop/FileDrop';
import { toast } from '../../../components/Toast';

import SocketConnect from '../../../utils/socketConnect';
import Visualizer from '../../../utils/visualizer';
import formatSize from '../../../utils/formatSize';
import pluralize from '../../../utils/pluralize';
import constants from '../../../../../common/constants';
import roomsDispatch from '../../../reducers/rooms';

import './FileTransfer.scss';

const CanvasUnwrapped = (props, ref) => {
  return <canvas ref={ref} {...props} />;
};

const Canvas = memo(forwardRef(CanvasUnwrapped));

class FileTransfer extends PureComponent {

  constructor(props) {
    super(props);
    let { room } = props;
    room = room.replace(/-/g, ' ');
    const savedData = JSON.parse(localStorage.getItem('blaze'));
    this.client = {
      ...savedData.user,
      room,
    };

    this.state = {
      percentage: null,
      peers: [],
      isP2P: true,
      files: [],
      filesQueued: 0,
      errorModal: {
        isOpen: false,
        message: '',
      },
      isSelectorEnabled: false,
    };

    this.canvas = createRef();
    this.fileInput = createRef();

    /**
     * Add the current room in recent rooms list
     */
    roomsDispatch({ type: 'add-room', payload: room });
  }

  onUserJoin(users) {
    let isP2P = this.state.isP2P;

    users.forEach(user => {
      if (user.name === this.client.name) return;

      isP2P = isP2P && !!user.peerId;
      this.visualizer.addNode({
        name: user.name,
        peerId: user.peerId,
      });
    });

    this.setState({
      peers: users.map(user => user.name),
      isP2P,
      isSelectorEnabled: users.length - 1 > 0
    });
  }

  onUserLeave(user) {
    this.visualizer.removeNode(user);
    const peers = this.state.peers.filter(peer => peer !== user);
    this.setState({
      peers,
      isSelectorEnabled: peers.length - 1 > 0,
    });
  }


  /**
   * DOM is reset to prepare for the next file transfer
   */
  resetState() {
    this.visualizer.stopSharing();
    this.setState({
      filesQueued: 0,
      percentage: null,
      files: this.state.files.map(file => {
        file.sent = true;
        return file;
      }),
      isSelectorEnabled: this.state.peers.length - 1 > 0,
    });

    // Remove the file from the input
    this.fileInput.current.value = '';
  }

  selectFiles = (inputFiles) => {

    /**
     * When no files are selected(can occur when text selection is dropped)
     */
    if (!inputFiles || !inputFiles.length) {
      toast('Invalid file selected');
      return;
    }

    /**
     * Firefox for mobile has issue with selection of multiple files.
     * Only one file gets selected and that has '0' size. This is
     * checked here before proceeding to transfer the invalid file.
     */
    if (inputFiles[0].size === 0) {
      toast('Multiple files not supported on this browser');
      return;
    }

    /**
     * File selector was disabled, but somehow new files were received
     */
    if (!this.state.isSelectorEnabled) {
      toast('File transfer is not possible right now');
      return;
    }

    let filesQueued = inputFiles.length;
    this.setState({
      filesQueued: inputFiles.length,
    });

    /**
     * Start sending files
     */
    this.fileShare
      .sendFiles({
        numPeers: this.state.peers.length,
        input: inputFiles,
        useTorrent: this.state.isP2P,

        onMeta: (metaData) => {
          metaData = metaData.map(file => ({
            ...file,
            sentTo: this.state.peers.filter(name => name !== this.client.name),
          }));

          filesQueued -= metaData.length;
          this.setState({
            filesQueued,
            files: [...metaData, ...this.state.files],
            isSelectorEnabled: false,
          });
        },
        onTorrentProgress: ({ wires, length: fileSize }) => {
          let progress = 0;
          const receivers = wires.filter(wire => wire.uploadSpeed());

          /**
           * Calculates upload progress,
           * Upload progress is calculated based on amount of data sent to each of the receiving peer.
           * Hence it's not the overall measure of file sent, as the receiving peers may change during the transfer process
           * which would affect the upload progress shown
           */
          this.visualizer.startSharing(
            receivers.map(wire => {
                progress += wire.uploaded / fileSize;
                return wire.peerId;
              }),
            []
          );
          this.setState({
            percentage: receivers.length ? progress / receivers.length * 100 : 0,
            isSelectorEnabled: false
          });
        },
        onSocketProgress: ({ progress }) => {
          const percentage = progress * 100;
          this.setState({
            percentage,
            isSelectorEnabled: false,
          });
          this.visualizer.startSharing();

          if (percentage >= 100) {
            this.resetState();
          }
        },
        onDone: () => {
          this.setState({
            files: this.state.files.map(file => ({ ...file, sent: true })),
          });
          this.visualizer.stopSharing();
          this.resetState();
        },
      })
      .catch(err => {
        switch (err.message) {
          case constants.ERR_LARGE_FILE:
            // File selected by the user is larger than the set limit
            toast(`File size is limited to ${formatSize(this.state.isP2P ? TORRENT_SIZE_LIMIT : WS_SIZE_LIMIT)}`)
            break;
          default:
            // Some other error occurred
            toast('An error occured');
        }
        this.resetState();
      });
  }

  componentDidMount() {
    document.title = `${this.client.room} room | Blaze`;

    this.visualizer = new Visualizer(this.canvas.current);
    this.fileShare = new SocketConnect(this.client.room, this.client.name);
    const { socket } = this.fileShare;

    this.visualizer.addNode({
      name: this.client.name,
      isClient: true,
    });

    socket.listen(constants.USER_JOIN, this.onUserJoin.bind(this));
    socket.listen(constants.USER_LEAVE, this.onUserLeave.bind(this));
    socket.on('close', data => {
      this.setState({
        errorModal: {
          isOpen: true,
          type: data.reason || constants.ERR_CONN_CLOSED,
        },
      });
    });


    this.clearReceiver = this.fileShare.receiveFiles({
      onMeta: (data) => {
        this.sender = data.sender;
        data.meta.forEach(file => {
          file.sentBy = data.sender;
        });

        this.setState({
          files: [...data.meta, ...this.state.files],
          isSelectorEnabled: false,
        });
      },
      onProgress: ({ progress, wires }) => {
        const receivedBy = [];
        const sentTo = [];

        if (wires !== undefined) {
          wires.forEach(wire => {
            if (wire.uploadSpeed()) {
              sentTo.push(wire.peerId);
            } else if (wire.downloadSpeed()) {
              receivedBy.push(wire.peerId);
            }
          });
        }
        else {
          receivedBy.push(this.sender);
        }

        this.visualizer.startSharing(sentTo, receivedBy);
        this.setState({
          percentage: progress * 100,
          isSelectorEnabled: false,
        });
      },
      onDone: (file, meta) => {
        if (file !== undefined) {
          if (Array.isArray(file)) {
            file.forEach(file => {
              file.getBlob((err, blob) => download(blob, file.name));
            });
          }
          else {
            download(file, meta.name, meta.type);
          }
        }
        this.resetState();
      },
    });
  }

  componentWillUnmount() {
    const { socket } = this.fileShare;

    if (this.clearReceiver) {
      this.clearReceiver();
    }

    socket.off(constants.USER_JOIN);
    socket.off(constants.USER_LEAVE);
    socket.close();
  }

  handleNewRoom = () => {
    this.setState({
      errorModal: {
        isOpen: false,
      },
    });

    route('/app', true);
  }

  handleShare = () => {
    if (!navigator.share) {
      this.copyLink();
      return
    }

    navigator.share({
      title: 'Share files',
      text: `Join my room '${this.client.room}' on Blaze to share files`,
      url: window.location.href,
    });
  }

  handleQueuedFiles = () => {
    this.selectFiles(this.props.queuedFiles);
    this.props.setQueuedFiles([]);
  }
  copyLink = () => {
    if (navigator.share)
      this.handleShare();
    else {
      copy(window.location.href);
      toast('Room link copied to clipboard');
    }
  }

  getFileIcon(file) {
    const size = 20;

    switch (file.type.split('/')[0]) {
      case 'image':
        return <Image size={size} />;
      case 'video':
        return <Film size={size} />;
      case 'audio':
        return <Music size={size} />;
      case 'application':
        return <Box size={size} />;
      default:
        return <File size={size} />;
    }
  }

  renderFile(file) {
    let fileProgress = (
      <div class="file-progress spinner">
        <svg width="30" height="30">
          <circle cx="15" cy="15" r="10" stroke-dashoffset="40" />
        </svg>
      </div>
    );

    if (file.sent) {
      fileProgress = (
        <div class="file-complete">
          <CheckCircle />
        </div>
      );
    } else if (this.state.percentage) {
      fileProgress = (
        <div class="file-progress">
          <svg width="30" height="30">
            <circle cx="15" cy="15" r="10" style={`stroke-dashoffset:${63 * this.state.percentage / 100 - 63}`} />
          </svg>
        </div>
      );
    }

    return (
      <li>
        <div class="file-type">
          {this.getFileIcon(file)}
        </div>
        <div class="info">
          <h4>{file.name}</h4>
          <p>
            {formatSize(file.size)}
            {!!file.sentBy && ` | Sent by ${file.sentBy}`}
            {!!file.sentTo && ` | You sent to ${file.sentTo.join(', ')}`}
          </p>
        </div>

        {fileProgress}
      </li>
    );
  }

  renderErrorContent() {
    const { errorModal } = this.state;

    switch (errorModal.type) {
      case constants.ERR_SAME_NAME:
        return (
          <>
            <h2>Connection Error!</h2>
            <p class="message">User with same name exists in this room</p>
            <button class="btn wide" onClick={this.handleNewRoom}>
              Select new room
            </button>
          </>
        );
      case constants.ERR_CONN_CLOSED:
      default:
        return (
          <>
            <h2>Connection closed</h2>
            <p class="message">Tip: Try refreshing this page</p>

            <button class="btn wide" onClick={() => window.location.reload()}>
              Refresh page
            </button>
          </>
        );
    }
  }

  render({ queuedFiles }, { percentage, peers, isP2P, files, filesQueued, errorModal, isSelectorEnabled }) {

    return (
      <div class="file-transfer">
        <header class="app-header">
          <button class="btn thin icon left" aria-label="Go back" onClick={() => window.history.back()}>
            <ArrowLeft />
          </button>

          <h1 class="room-name">
            {this.client.room}
          </h1>

          <button
            class="btn thin icon right"
            aria-label={navigator.share ? 'Share room link' : 'Copy room link'}
            onClick={navigator.share ? this.handleShare : this.copyLink}
          >
            <Share2 />
          </button>
        </header>

        <main>

          <div>
            <Canvas ref={this.canvas} style="margin-left: -0.6rem" />

            {
              percentage !== null && (
                <div class="transfer-percentage">
                  {Math.floor(percentage)}%
                </div>
              )
            }

            <div class={`transfer-help ${peers.length > 1 && isP2P && 'p2p'}`}>
              {
                peers.length <= 1 ? 'Share room link to devices you want to share files with'
                  : isP2P ? (
                    <>
                      <Zap size={20} /> Established a P2P connection!
                    </>
                  )
                    : 'Using an intermediate server for sharing files'
              }
            </div>

            {
              peers.length <= 1 && (
                <div class="share-room-link">
                  <input value={window.location.href} disabled />
                  <button class="btn outlined" onClick={navigator.share ? this.handleShare :this.copyLink}>
                    {navigator.share ? 'Share room link' : 'Copy room link'}
                  </button>
                </div>
              )
            }
          </div>


          <input
            ref={this.fileInput}
            type="file"
            hidden
            onChange={e => this.selectFiles(e.target.files)}
            multiple
          />

          {
            (!!files.length || !!filesQueued) && (
              <div class="card files-container">
                <div class="header">
                  <h2>Files</h2>
                  {
                    !!filesQueued && (
                      <div class="queue">
                        {filesQueued}
                        {' '}
                        {pluralize(filesQueued, 'file is', 'files are')}
                        {' '}
                        in queue
                      </div>
                    )
                  }
                </div>
                <ul class="files">
                  {files.map(file => this.renderFile(file))}
                </ul>
              </div>
            )
          }

          {
            queuedFiles.length ? (
              <Fab
                text={`Send selected ${pluralize(queuedFiles.length, 'file', 'files')}`}
                variant="lg"
                disabled={!isSelectorEnabled}
                onClick={this.handleQueuedFiles}
              >
                <Send size={20} />
              </Fab>
            ) : (
                <Fab text="Send File" disabled={!isSelectorEnabled} onClick={() => this.fileInput.current.click()}>
                  <Plus />
                </Fab>
              )
          }

        </main>

        <Modal isClosable={false} isOpen={errorModal.isOpen}>
          <div class="socket-error">
            {this.renderErrorContent()}
          </div>
        </Modal>

        { isSelectorEnabled && <FileDrop onFile={this.selectFiles} />}
      </div>
    );
  }
}

export default withQueuedFiles(FileTransfer);
