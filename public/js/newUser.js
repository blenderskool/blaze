function loadNewUser() {
  const app = document.getElementById('app');
  app.classList.add('center-center');
  clearNode(app);

  const frmNewUser = document.createElement('form');

  const inpName = document.createElement('input');
  inpName.required = true;
  inpName.type = 'text';
  inpName.placeholder = 'Cool nickname';
  inpName.maxLength = '10';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.innerText = 'Start sharing';

  frmNewUser.addEventListener('submit', e => {
    e.preventDefault();

    localStorage.setItem('blaze', JSON.stringify({
      user: {
        name: inpName.value
      },
      rooms: []
    }));

    loadHome();

  });

  frmNewUser.appendChild(inpName);
  frmNewUser.appendChild(submit);
  app.appendChild(frmNewUser);
}