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

let $visualizer, $socket, $user;

/**
 * Loads the file transfer view of the app
 */
function loadApp() {
  clearNode(document.body);

  $user = {
    name: prompt('Enter your nickname'),
    room: Object.keys(urlParams)[0]
  };
  $socket = new P2P(socketConnect($user.room, $user.name), {}, () => console.log('Using WebRTC'));
  $socket.on('userJoin', userJoined);
  $socket.on('userLeft', userLeft);
  $socket.on('go-private', () => {
    $socket.useSockets = false;
  });
  

  let files = [];
  $socket.on('file', data => {

    if (data.end) {
      download('data:application/octet-stream;base64,' + files.join(''), data.name ? data.name : 'hello');
      files = [];

      setTimeout(() => {
        $visualizer.removeSender();
        document.getElementById('inpFiles').style.display = 'block';
      }, 2000);
    }
    else {
      document.getElementById('inpFiles').style.display = 'none';

      files.push(data.file);

      $visualizer.addSender(data.user);

      const percentage = (files.length*8000)/data.size*100;

      $visualizer.setTransferPercentage(percentage);
      document.getElementById('txtPerc').innerText = Math.floor(percentage) + '%';
    }
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
  
  const lstFiles = document.createElement('ul');

  header.appendChild(heading);
  header.appendChild(inp);

  card.append(header);
  card.append(lstFiles);


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
      status.innerText = '2.5s';
      
      const fileName = document.createElement('h4');
      fileName.innerText = file.name;
      
      const fileSize = document.createElement('h5');
      fileSize.innerText = file.size;

      info.appendChild(fileName);
      info.appendChild(fileSize);

      li.appendChild(info);
      li.appendChild(status);

      lstFiles.appendChild(li);
    }
  });

  document.body.appendChild(perc);
  document.body.appendChild(card);
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


document.getElementById('btnStart').addEventListener('click', loadApp);


function fileTransfer(file) {
  // goPrivate();
  getBase64(file).then(data => {

    $visualizer.addSender($user.name);
    let sent = 0;
    const size = data.length;

    function stream() {

      $socket.emit('file', {
        file: data.slice(0, 8000),
        user: $user.name,
        size: size
      });

      sent += 8000;
      data = data.slice(8000);

      $visualizer.setTransferPercentage(sent/size*100);

      if (data) {
        console.log(data.length);
        setTimeout(stream, 1);
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
        }, 2000);
      }
    }
    stream();

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