<script>
  import { onMount } from 'svelte';
  import { Visualizer } from '../modules/visualizer';
  import download from 'downloadjs';
  import { navigate } from 'svelte-routing';
  import Fab from '../components/Fab.svelte';
  import Modal from '../components/Modal.svelte';

  const data = JSON.parse(localStorage.getItem('blaze'));
  let errorModal = {
    isOpen: false,
    message: ''
  };

  let visualizer, socket, usersCount = 1;

  let client = {
    ...data.user,
    room: window.location.pathname.split('/').reverse()[0]
  };
  let canvas, isSelectorEnabled = false, files = [];
  let backend = 'Waiting for other devices to join same room';
  let percentage = null;

  /**
   * Add the current room in recent rooms list
   */
  if (!data.rooms.includes(client.room)) {
    localStorage.setItem('blaze', JSON.stringify({
      ...data,
      rooms: [
        client.room,
        ...data.rooms
      ]
    }));
  }

  function socketConnect(room, username) {
    return io('//'+window.location.host, {
      query: `room=${room}&user=${username}`,
    });
  }

  function selectFiles(e) {
    const inputFiles = e;
    /**
     * Web worker is setup to compress the files off the main thread
     * Send the files to the worker to compress them as a zip
     */
    const worker = new Worker('/worker.js');
    worker.postMessage(inputFiles);

    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];

      files = [
        {
          name: file.name,
          size: file.size,
          sent: false
        },
        ...files
      ];
    }
    
    worker.addEventListener('message', evt => {
      /**
       * Pre file transfer DOM changes are made here
       * Set the sender in visualizer
       */
      visualizer.addSender(client.name);

      // Start the file transfer
      fileTransfer(evt.data)
      .then(resetState)
      .catch(err => {
        console.log('Error in transferring the file', err);
      });
    });

    /**
     * Error from the worker
     */
    worker.addEventListener('error', err => {
      console.log('Error in compressing the files', err);
    });
  }

  /**
   * Returns an easy to read formatted size from input file size
   */
  function formatSize(size) {
    return size / (1024 * 1024) < 1 ? Math.round((size / 1024) * 10) / 10 + 'KB' : Math.round((size / (1024 * 1024) * 10)) / 10 + 'MB';
  }


  /**
   * Sends the file in chunks acorss socket connection
   * @param {ArrayBuffer} file File object which has to be sent
   * @param {Array} meta Meta data of files which are being sent
   */
  function fileTransfer(file) {

    let data = file, sent = 0;
    const size = data.byteLength;
    const transferStatus = {
      peers: Array(usersCount - 1),
      percent: 25
    };

    /**
     * Initially meta data is shared
     */
    socket.emit('file', {
      user: client.name,
      size,
      meta: files.filter(item => !item.sent)
    });


    return new Promise((resolve, reject) => {

      function stream() {
        /**
         * If all the chunks are sent
         */
        if (!data.byteLength) {
          /**
           * Indicates that the stream has ended and file should now be built
           * on the receiver's system
           */
          socket.emit('file', {
            end: true,
          });
          // Switch off the status event listener as transfer is complete
          socket.off('rec-status');

          /**
           * 2 seconds timeout before the file transfer is resolved
           */
          setTimeout(() => resolve(), 2000);

          return;
        }

        /**
         * Defines the size of data that will be sent in each request (KBs)
         * Set to 16 KBs
         */
        let block = 1024 * 16;
        // Block size correction if data remaining is lesser than block
        block = block > data.byteLength ? data.byteLength : block;

        /**
         * Send a chunk of data
         */
        socket.emit('file-data', data.slice(0, block));

        /**
         * Update for next iteration
         */
        sent += block;
        data = data.slice(block, data.byteLength);

        /**
         * Percentage calculation and DOM update
         */
        percentage = sent * 100 / size;
        visualizer.setTransferPercentage(percentage);

        if (transferStatus.peers.length === usersCount - 1 && percentage < transferStatus.percent) {
          /**
           * Timeout is used as this will allow us to control the time interval between successive streams
           */
          setTimeout(stream, 1);
        }
      }
      stream();

      socket.on('rec-status', data => {
        if (data.percent !== transferStatus.percent) {
          transferStatus.percent = data.percent;
          transferStatus.peers = [ data.peer ];
        }
        else {
          transferStatus.peers.push(data.peer);
        }

        stream();
      });
    });

  }

  /**
   * DOM is reset to prepare for the next file transfer
   */
  function resetState() {
    visualizer.removeSender();

    percentage = null;

    // Mark the unsent files as sent
    files = files.map(file => {
      file.sent = true;
      return file;
    });

    // Remove the file from the input
    document.getElementById('inpFiles').value = '';
  }

  onMount(() => {

    socket = new P2P(socketConnect(client.room, client.name), {
      peerOpts: {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            { urls: 'stun:stun.services.mozilla.com' },
            {
              urls: 'turn:numb.viagenie.ca',
              username: 'akash.hamirwasia@gmail.com',
              credential: '6NfWZz9kUCPmNbe'
            }
          ]
        }
      }
    }, () => {
      /**
       * Connection upgrded to WebRTC
       */
      backend = 'Using WebRTC';
    });

    /**
     * A user joins the room
     */
    socket.on('userJoin', users => {
      /**
       * Online users list is rendered
       */
      users.forEach(user => {
        if (user === client.name) return;

        visualizer.addNode(user);

        /**
         * Fallback WebSockets tech is used by default. When connection switches to WebRTC,
         * then the update is made in a separate event - set during the socket initialization
         */
        if (backend !== 'Using WebRTC')
          backend = 'Using WebSockets';

      });

      usersCount = users.length;

    });

    /**
     * A user leaves the room
     */
    socket.on('userLeft', user => {
      // Remove the user from the visualizer
      visualizer.removeNode(user);
      // Update the userCount
      usersCount -= 1;
    });

    /**
     * If there's some problem in socket connection, then send the user back to the app homepage
     */
    socket.on('error', error => {
      errorModal = {
        isOpen: true,
        message: error
      };
    });

    /**
     * Visualizer is half the width of the browser window if on desktops
     */
    if (window.matchMedia('(min-width: 800px)').matches)
      visualizer = new Visualizer(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2), canvas);
    /**
     * On mobiles, occupy full width of the screen
     */
    else
      visualizer = new Visualizer(window.innerWidth, Math.floor(window.innerHeight / 2), canvas);

    visualizer.addNode(client.name, true);

    /**
     * Receiving the file
     */
    (function() {

      let fileParts = [];
      let metaData = {};
      let intPerc = 25, size = 0;
      socket.on('file', data => {

        if (data.end) {

          if (fileParts.length) {
            download(new Blob(fileParts), 'blaze_files.zip');
            fileParts = [];
            size = 0;
            intPerc = 25;
          }

          /**
           * Download complete! Yay!
           * Reset the state of the app for next data transfer
           */
          setTimeout(resetState, 2000);

        }
        else {
          /**
           * If data does not have 'end' key, then meta data has been sent just before
           * the file transfer
           */
          metaData = data;
          visualizer.addSender(data.user);
          files = [...data.meta, ...files];
        }
      });

      socket.on('file-data', data => {
        // document.getElementById('btn-addFiles').disabled = true;

        fileParts.push(data);
        size += data.byteLength;

        percentage = size * 100 / metaData.size;

        if (percentage >= intPerc) {
          intPerc += 15;
          socket.emit('rec-status', {
            percent: intPerc,
            peer: client.name,
            sender: metaData.user
          });
        }

        visualizer.setTransferPercentage(percentage);
      });
    })();

    /**
     * Component being unmounted
     */
    return () => {
      socket.disconnect();
    };

  });

  function watchUsersCount(usersCount, percentage) {
    isSelectorEnabled = (usersCount - 1) ? true : false;

    isSelectorEnabled = percentage === null ? isSelectorEnabled : false;
  }

  $: watchUsersCount(usersCount, percentage);

  function dropHandler(ev) 
  {
    var files = ev.dataTransfer.files;
    document.getElementById('drop_zone').style.border = 'none';
    if (files != null && isSelectorEnabled)
    {
      selectFiles(files);
    }
  }

</script>

<div id="app" style="text-align:center">
  <header>
    <button
      class="thin icon icon-navigate_before left"
      aria-label="Go back"
      on:click={() => window.history.back()}
    />

    <h1 class="room-name">
      {client.room}
    </h1>

    <!-- Fake element to correct the flex spacing -->
    <button
      class="thin icon right"
      style="visibility: hidden"
    />

  </header>

  <main class="row file-transfer">

    <div class="column">
      <canvas
        bind:this={canvas}
        style="margin-left: -1rem"
      />

      {#if percentage !== null}
        <div class="transfer-percentage">
          {Math.floor(percentage)}%
        </div>
      {/if}

      <div class="transfer-tech">
        {backend}
      </div>
    </div>


    <input
      id="inpFiles"
      type="file"
      hidden
      on:change={ev => selectFiles(ev.target.files)}
      multiple
    >

    {#if files.length}
      <div class="column">
        <div class="card files">
          <div class="header">
            <h2>Files</h2>
          </div>
          <ul class="files">

            {#each files as file}
              <li>
                <div class="info">
                  <h4>{file.name}</h4>
                  <h5>{formatSize(file.size)}</h5>
                </div>

                {#if file.sent}
                  <!-- When the file has been sent, show the check mark -->
                  <div class="file-status icon-checkmark" />
                {:else}
                  <!-- When the file is being sent, show a circle loader with transfer percentage -->
                  <svg width="50" height="50" class="file-status">
                    <circle cx="25" cy="25" r="10" style={`stroke-dashoffset:${63 * percentage/100 - 63}`} />
                  </svg>
                {/if}
              </li>
            {/each}

          </ul>
        </div>
      </div>
    {/if}

  </main>

  <Fab
    name="fab"
    icon="icon-add"
    disabled={!isSelectorEnabled}
    text="Add File"
    on:click={() => document.getElementById('inpFiles').click()}
  >
  </Fab>

  <div
    id="drop_zone"
    class="dropzone"
    on:drop|preventDefault={dropHandler}
    on:dragover|preventDefault={e => {e.target.style.border = 'solid';}}
    on:dragleave|preventDefault={e => {e.target.style.border = 'none';}}
    >
  </div>
</div>

<!-- Socket connection error modal cannot be closed by the user -->
<Modal isOpen={errorModal.isOpen} isClosable={false}>

  <div class="socket-error">
    <h2>Connection Error!</h2>

    <p class="message">
      {errorModal.message}
    </p>

    <button class="wide" on:click={() => {
      errorModal.isOpen = false;
      navigate('/app', { replace: true })
    }}>
      Select new room
    </button>

  </div>	
</Modal>