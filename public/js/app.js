let $visualizer, $socket, $user, $usersCount;



/**
 * Loads the file transfer view of the app
 * @param {String} room Name of the room user is joining
 */
function loadApp(room) {
  const app = document.getElementById('app');
  app.classList.add('center');
  clearNode(app);

  $user = {
    ...JSON.parse(localStorage.getItem('blaze')).user,
    room: room
  };
  $usersCount = 1;
  
  /**
   * Setting up the socket connection and socket events
   */
  $socket = new P2P(socketConnect($user.room, $user.name), {
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
    const backend = document.getElementById('txtTech');
    
    if (backend)
      backend.innerText = 'Using WebRTC';
  });
  $socket.on('userJoin', users => {
    /**
     * Online users list is rendered
     */
    users.forEach(user => {
      if (user === $user.name) return;

      $visualizer.addNode(user);

      const txtTech = document.getElementById('txtTech');
      /**
       * Fallback WebSockets tech is used by default. When connection switches to WebRTC,
       * then the update is made in a separate event - set during the socket initialization
       */
      if (txtTech.innerText !== 'Using WebRTC')
        txtTech.innerText = 'Using WebSockets';

    });

    $usersCount = users.length;
    
    updateFAB();

  });
  $socket.on('userLeft', user => {
    // Remove the user from the visualizer
    $visualizer.removeNode(user);
    // Update the userCount
    $usersCount -= 1;

    updateFAB();
  });

  /**
   * If there's some problem in socket connection, then send the user back to previous page
   * TODO: Instead of sending the user to previous page, redirect to the homepage to prevent user from leaving the app
   */
  $socket.on('error', error => {

    const div = document.createElement('div');
    div.classList.add('socket-error');

    const h2 = document.createElement('h2');
    h2.innerText = 'Connection Error!';

    const p = document.createElement('p');
    p.classList.add('message');
    p.innerText = error;

    const btn = document.createElement('button');
    btn.innerText = 'Select new room';
    btn.addEventListener('click', () => 
      // Go to the previous page once modal is closed
      Modal.close(() => {
        window.history.back();
      })
    );
    
    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(btn);

    new Modal(div, true);
    Modal.open();
  });


  /**
   * Layout is created here
   */
  const canvas = document.createElement('canvas');
  $visualizer = new Visualizer(window.innerWidth, Math.floor(window.innerHeight / 2), canvas);
  $visualizer.addNode($user.name, ['50%', '50%'], true);

  const backBtn = document.createElement('button');
  backBtn.classList.add('icon-navigate_before', 'header', 'left');
  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  const roomName = document.createElement('h2');
  roomName.classList.add('room-name');
  roomName.innerText = $user.room;

  const perc = document.createElement('div');
  perc.id = 'txtPerc';

  const backend = document.createElement('div');
  backend.id = 'txtTech';
  // Waiting for other devices to connect
  backend.innerText = 'Waiting for other devices to join same room';

  const card = document.createElement('div');
  card.classList.add('card', 'files');

  const header = document.createElement('div');
  header.classList.add('header');

  const heading = document.createElement('h2');
  heading.innerText = 'Files';

  const inp = document.createElement('input');
  inp.id = 'inpFiles';
  inp.type = 'file';
  inp.multiple = true;
  inp.style.display = 'none';

  // Add the FAB button to add files
  const fab = document.createElement('button');
  fab.classList.add('fab');
  fab.id = 'btn-addFiles';
  fab.disabled = true;

    // Label for triggering the file picker
    const lbl = document.createElement('label');
    lbl.setAttribute('for', inp.id);
    lbl.setAttribute('aria-label', 'Choose files to send');
    lbl.classList.add('icon-add', 'input-files');

  fab.appendChild(lbl);
  // Keyboard accessibility for the FAB
  fab.addEventListener('keydown', e => {
    if (e.which === 13) {
      inp.click();
    }
  });


  const lstFiles = document.createElement('ul');
  lstFiles.id = 'lstFiles';

  header.appendChild(heading);
  header.appendChild(inp);

  card.append(header);
  card.append(lstFiles);

  app.appendChild(backBtn);
  app.appendChild(roomName);
  app.appendChild(canvas);
  app.appendChild(perc);
  app.appendChild(backend);
  app.appendChild(card);
  app.appendChild(fab);

  /**
   * Sending the file
   */
  inp.addEventListener('change', e => {
    const files = e.target.files;
    const filesMeta = [];

    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      filesMeta.push({
        name: file.name,
        size: file.size
      });

      zip.file(file.name, file);
    }

    // Render the meta data of files being transferred
    renderFileList(filesMeta);

    zip.generateAsync({
      type: 'arraybuffer',
    })
    .then(zipFile => {
      /**
       * Pre file transfer DOM changes are made here
       * Set the sender in visualizer
       * Hide the file add button to prevent addition of files during transfer
       */
      $visualizer.addSender($user.name);
      document.getElementById('btn-addFiles').disabled = true;

      return fileTransfer(zipFile, filesMeta);
    })
    .then(resetState)
    .catch(() => {
      console.log('Error is transferring the file');
    });

  });


  /**
   * Receiving the file
   */
  let files = [];
  let metaData = {};
  let intPerc = 25, size = 0;
  const txtPerc = document.getElementById('txtPerc');
  $socket.on('file', data => {

    if (data.end) {

      if (files.length) {
        download(new Blob(files), 'blaze_files.zip');
        files = [];
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
      $visualizer.addSender(data.user);
      renderFileList(data.meta);
    }
  });

  $socket.on('file-data', data => {
    document.getElementById('btn-addFiles').disabled = true;

    files.push(data);
    size += data.byteLength;

    const percentage = size * 100 / metaData.size;
    const percFloor = Math.floor(percentage);

    if (percentage >= intPerc) {
      intPerc += 15;
      $socket.emit('rec-status', {
        percent: intPerc,
        peer: $user.name,
        sender: metaData.user
      });
    }

    $visualizer.setTransferPercentage(percentage);
    txtPerc.innerText = percFloor + '%';
  });
}

/**
 * Creates a new socket connection in the room
 * @param {String} room Name of the room the user is joining
 * @param {String} username Name of the user
 */
function socketConnect(room, username) {
  return io(window.location.host, {
    query: `room=${room}&user=${username}`,
  });
}

/**
 * Sends the file in chunks acorss socket connection
 * @param {ArrayBuffer} file File object which has to be sent
 * @param {Array} meta Meta data of files which are being sent
 */
function fileTransfer(file, meta) {

    let data = file, sent = 0;
    const txtPerc = document.getElementById('txtPerc');
    const size = data.byteLength;

    /**
     * Initially meta data is shared
     */
    $socket.emit('file', {
      user: $user.name,
      size,
      meta
    });


  return new Promise((resolve, reject) => {

    function stream(meta) {
      /**
       * If all the chunks are sent
       */
      if (!data.byteLength) {
        /**
         * Indicates that the stream has ended and file should now be built
         * on the receiver's system
         */
        $socket.emit('file', {
          end: true,
        });
        // Switch off the status event listener as transfer is complete
        $socket.off('rec-status');

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
      $socket.emit('file-data', data.slice(0, block));

      /**
       * Update for next iteration
       */
      sent += block;
      data = data.slice(block, data.byteLength);

      /**
       * Percentage calculation and DOM update
       */
      const percentage = sent * 100 / size;
      $visualizer.setTransferPercentage(percentage);
      txtPerc.innerText = Math.floor(percentage) + '%';

      if (percentage < meta.percent) {
        /**
         * Timeout is used as this will allow us to control the time interval between successive streams
         */
        setTimeout(() => stream(meta), 1);
      }
    }
    stream({
      percent: 25
    });

    $socket.on('rec-status', stream);
  });

}

/**
 * Renders a list of files which are being transferred with meta data
 * @param {Array} files Meta data of files
 */
function renderFileList(files) {
  if (!files.length) return;

  // Display the files card
  document.querySelector('.card.files').style.display = 'block';

  const lstFiles = document.getElementById('lstFiles');

  files.forEach(file => {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.classList.add('info');
  
    // const status = document.createElement('span');
    // status.classList.add('status');
    // status.id = file.name + '-status';
    // status.innerText = '0s';

    const fileName = document.createElement('h4');
    fileName.innerText = file.name;

    const fileSize = document.createElement('h5');
    fileSize.innerText = file.size / (1024 * 1024) < 1 ? Math.round((file.size / 1024) * 100) / 100 + 'KB' : Math.round((file.size / (1024 * 1024) * 100)) / 100 + 'MB';
    
    info.appendChild(fileName);
    info.appendChild(fileSize);
  
    li.appendChild(info);
    // li.appendChild(status);
  
    lstFiles.appendChild(li);
  });

}

/**
 * DOM is reset to prepare for the next file transfer
 */
function resetState() {
  $visualizer.removeSender();

  document.getElementById('txtPerc').innerText = '';
  document.getElementById('btn-addFiles').disabled = false;

  // Remove the file from the input
  document.getElementById('inpFiles').value = '';
}


/**
 * Enable file selector only when there are more than one user in network
 */
function updateFAB() {
  const btnAddFiles = document.getElementById('btn-addFiles');
  if ($usersCount > 1) {
    btnAddFiles.disabled = false
  }
  else {
    btnAddFiles.disabled = true;
  }
}