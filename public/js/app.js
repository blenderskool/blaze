let urlParams;
(window.onpopstate = function () {
  let match,
    pl = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
})();


/**
 * Removes all the child elements from a node
 * @param {Node} node Node for which children should be removed
 */
function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}


const store = localStorage;
let $visualizer, $socket, $user;

if (!store.getItem('blaze')) window.location.pathname = '/new';

/**
 * Loads the file transfer view of the app
 */
function loadApp() {
  const app = document.getElementById('app');
  app.classList.remove('center-center');
  clearNode(app);

  $user = {
    ...JSON.parse(store.getItem('blaze')),
    room: Object.keys(urlParams)[0]
  };
  // $socket = socketConnect($user.room, $user.name);
  $socket = new P2P(socketConnect($user.room, $user.name), {
    peerOpts: {
      config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          },
          {
            urls: 'stun:numb.viagenie.ca',
            username: 'akash.hamirwasia@gmail.com',
            credential: '6NfWZz9kUCPmNbe'
          }
        ]
      }
    }
  }, () => console.log('Using WebRTC'));
  $socket.on('userJoin', userJoined);
  $socket.on('userLeft', userLeft);
  $socket.on('go-private', () => {
    $socket.useSockets = false;
  });
  
  
  $visualizer = new Visualizer(window.innerWidth, Math.floor(window.innerHeight / 2));
  $visualizer.addNode($user.name, ['50%', '50%'], true);

  const perc = document.createElement('div');
  perc.id = 'txtPerc';

  const card = document.createElement('div');
  card.classList.add('card');

  const header = document.createElement('div');
  header.classList.add('header');

  const heading = document.createElement('h2');
  heading.innerText = 'Files';

  const inp = document.createElement('input');
  inp.id = 'inpFiles';
  inp.type = 'file';
  inp.multiple = true;
  inp.style.display = 'none';

  const lbl = document.createElement('label');
  lbl.setAttribute('for', inp.id);
  lbl.classList.add('icon-add', 'input-files');
  lbl.setAttribute('role', 'button');
  lbl.tabIndex = 0;
  lbl.addEventListener('keydown', e => {
    if (e.which === 13) {
      inp.click();
    }
  });
  
  const lstFiles = document.createElement('ul');

  header.appendChild(heading);
  header.appendChild(inp);
  header.appendChild(lbl);

  card.append(header);
  card.append(lstFiles);

  app.appendChild(perc);
  app.appendChild(card);

  /**
   * Sending the file
   */
  inp.addEventListener('change', e => {
    const files = e.target.files;
    const file = files[0];
    fileTransfer(file);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const li = document.createElement('li');
      const info = document.createElement('div');
      info.classList.add('info');
      
      const status = document.createElement('span');
      status.classList.add('status');
      status.id = file.name + '-status';
      status.innerText = '0s';
      
      const fileName = document.createElement('h4');
      fileName.innerText = file.name;
      
      const fileSize = document.createElement('h5');
      fileSize.innerText = file.size/(1024*1024) < 1 ? Math.round((file.size/1024)*100)/100+'KB' : Math.round((file.size/(1024*1024)*100))/100+'MB';

      info.appendChild(fileName);
      info.appendChild(fileSize);

      li.appendChild(info);
      li.appendChild(status);

      lstFiles.appendChild(li);
    }
  });


  /**
   * Receiving the file
   */
  let files = [];
  const txtPerc = document.getElementById('txtPerc');
  let intPerc = 80;
  $socket.on('file', data => {

    if (data.end && files.length > 1) {
      download('data:application/octet-stream;base64,' + files.join(''), data.name ? data.name : 'hello');
      files = [];

      /**
       * Download complete! Yay!
       * Reset the state of the app for next data transfer
       */
      setTimeout(() => {
        $visualizer.removeSender();
        document.getElementById('inpFiles').style.display = 'block';
        txtPerc.innerText = '';
      }, 2000);

      clearInterval()
    }
    else {
      document.getElementById('inpFiles').style.display = 'none';

      files.push(data.file);

      $visualizer.addSender(data.user);

      const percentage = (files.length*8000)/data.size*100;
      const percFloor = Math.floor(percentage);
      
      if (percentage >= intPerc) {
        intPerc += 1;
        $socket.emit('rec-status', {
          percent: intPerc,
          peer: $user.name,
          sender: data.user
        });
      }

      $visualizer.setTransferPercentage(percentage);
      txtPerc.innerText = percFloor + '%';
    }
  });
}
if (Object.keys(urlParams).length)
  loadApp();


if (document.getElementById('frmJoinRoom')) {

  document.getElementById('frmJoinRoom').addEventListener('submit', e => {
    e.preventDefault();
    const inpRoom = document.getElementById('inpRoom');

    window.location.href = window.location.origin + '/?'+inpRoom.value.toLowerCase();
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
 * Switches to WebRTC connection
 */
function goPrivate() {
  $socket.emit('go-private', true);

  $socket.useSockets = false;
}


function userJoined(users) {

  /**
   * Online users list is rendered
   */
  users.forEach(user => {

    if (user !== $user.name)
      $visualizer.addNode(user);
  });

}

function userLeft(user) {
  $visualizer.removeNode(user);
}


function fileTransfer(file) {
  // goPrivate();
  getBase64(file).then(data => {

    $visualizer.addSender($user.name);
    let sent = 0;
    const txtPerc = document.getElementById('txtPerc');
    const size = data.length;

    function stream(meta) {
      
      /**
       * Defines the size of data that will be sent in each request
       */
      const block = 8000;

      $socket.emit('file', {
        file: data.slice(0, block),
        user: $user.name,
        size: size
      });

      sent += block;
      data = data.slice(block);

      const percentage = sent/size*100;
      $visualizer.setTransferPercentage(percentage);
      txtPerc.innerText = Math.floor(percentage) + '%';

      if (data) {
        if (percentage < meta.percent) {
          // console.log(data.length);
          setTimeout(() => stream(meta), 1);
        }
      }
      else {
        $socket.emit('file', {
          end: true,
          name: file.name,
          user: $user.name,
          size: size
        });

        setTimeout(() => {
          $visualizer.removeSender();
          txtPerc.innerText = '';
        }, 2000);
      }
    }
    stream({
      percent: 80
    });

    $socket.on('rec-status', stream);

  });
}


/**
 * Returns a promise which resolves into Base64 encoded string of the file
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}