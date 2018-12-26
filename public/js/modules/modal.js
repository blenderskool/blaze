class Modal {

  constructor(child) {
    const body = document.body;

    if (document.getElementById('mdl')) {
      const container = document.getElementById('mdl');
      clearNode(container);

      const modal = document.createElement('div');
      modal.classList.add('modal');

      const close = document.createElement('span');
      close.classList.add('icon-add');
      close.addEventListener('click', () => Modal.close());

      modal.appendChild(child);
      container.appendChild(close);
      container.appendChild(modal);
    }
    else {
      const container = document.createElement('div');
      container.id = 'mdl';

      const modal = document.createElement('div');
      modal.classList.add('modal');

      const close = document.createElement('span');
      close.classList.add('icon-add');
      close.addEventListener('click', () => Modal.close());

      modal.appendChild(child);
      container.appendChild(close);
      container.appendChild(modal);
      body.appendChild(container);
    }
  }

  static open() {
    const container = document.getElementById('mdl');
    document.getElementById('app').style.filter = 'blur(8px)';
    container.style.visibility = 'visible';
    container.style.opacity = 1;

  }

  static close() {
    const container = document.getElementById('mdl');

    document.getElementById('app').style.filter = '';
    container.style.visibility = 'hidden';
    container.style.opacity = 0;

  }

}