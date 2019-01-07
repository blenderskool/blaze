function loadHome() {
  const app = document.getElementById('app');
  app.classList.remove('center-center', 'center');
  clearNode(app);

  /**
   * Title
   */
  const h2 = document.createElement('h2');
  h2.classList.add('title');
  h2.innerText = 'Recent rooms';

  app.appendChild(h2);

  /**
   * Recent rooms list
   */
  let data = JSON.parse(localStorage.getItem('blaze'));
  let rooms = data.rooms;

  const lstRecentRooms = document.createElement('ul');
  lstRecentRooms.classList.add('recent-rooms');
  if (rooms && rooms.length) {

    function joinRoom() { $router.navigate('/app?room='+this.innerText.toLowerCase(), true) }

    rooms.forEach(room => {
      const li = document.createElement('li');
      li.setAttribute('role', 'link');
      li.setAttribute('tabindex', '0');
      li.innerText = room;
      li.addEventListener('click', joinRoom);

      const btnRemove = document.createElement('span');
      btnRemove.setAttribute('role', 'button');
      btnRemove.setAttribute('aria-label', 'Remove room');
      btnRemove.classList.add('icon-cancel');
      btnRemove.tabIndex = 0;
      btnRemove.addEventListener('click', e => {
        e.stopPropagation();

        rooms = rooms.filter(roomName => roomName !== room);
        data = {
          ...data,
          rooms
        };
        localStorage.setItem('blaze', JSON.stringify(data));

        lstRecentRooms.removeChild(li);
      });

      li.appendChild(btnRemove);
      lstRecentRooms.appendChild(li);
    });

  }
  app.appendChild(lstRecentRooms);


  /**
   * Join new room form
   */
  const frmJoinRoom = document.createElement('form');

  const inpRoom = document.createElement('input');
  inpRoom.type = 'text';
  inpRoom.maxLength = 10;
  inpRoom.required = true;
  inpRoom.placeholder = 'Room name';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.innerText = 'Join Room';

  frmJoinRoom.addEventListener('submit', e => {
    e.preventDefault();
    const room = inpRoom.value.toLowerCase();

    /**
     * Store the room in recently joined rooms
     */
    if (data.rooms && !data.rooms.includes(room)) {
      localStorage.setItem('blaze', JSON.stringify({
        ...data,
        rooms: [
          ...data.rooms,
          room
        ]
      }));
    }

    // Close the modal
    Modal.close();
    // Send the user to that room
    $router.navigate('/app?room='+room, true)
  });

  frmJoinRoom.appendChild(inpRoom);
  frmJoinRoom.appendChild(submit);

  new Modal(frmJoinRoom);
  if (!rooms || !rooms.length) {
    /**
     * If there is no recently joined rooms, show the modal directly
     */
    Modal.open();
  }

  /**
   * FAB
   */
  const fab = document.createElement('button');
  fab.classList.add('fab');
  // Add the icon
  fab.innerHTML = '<span class="icon-add"></span>';
  fab.addEventListener('click', () => Modal.open());

  app.appendChild(fab);

}