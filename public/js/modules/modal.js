class Modal {

  constructor(child, forcedOpen) {

    /**
     * Updates the exisiting modal container
     */
    if (document.getElementById('mdl')) {
      const container = document.getElementById('mdl');
      clearNode(container);

      Modal.addControllers(container, child, forcedOpen);
    }
    /**
     * Create a new modal container
     */
    else {
      const container = document.createElement('div');
      container.id = 'mdl';

      document.body.appendChild(Modal.addControllers(container, child, forcedOpen));
    }
  }

  /**
   * Adds additional controls to the modal container
   */
  static addControllers(container, child, forcedOpen) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.appendChild(child);

    if (!forcedOpen) {
      const close = document.createElement('span');
      close.classList.add('icon-cancel');
      close.setAttribute('role', 'button');
      close.tabIndex = 0;
      close.setAttribute('aria-label', 'Close Modal');
      close.addEventListener('click', () => Modal.close());
      close.addEventListener('keydown', e => { if (e.which === 13) Modal.close(); });

      container.appendChild(close);
    }

    container.appendChild(modal);

    return container;
  }

  /**
   * Open the modal window
   */
  static open() {
    const container = document.getElementById('mdl');
    document.getElementById('app').style.filter = 'blur(15px)';
    container.style.visibility = 'visible';
    container.style.opacity = 1;
    Modal.isOpen = true;
  }

  /**
   * Close the modal window
   */
  static close(cb) {
    const container = document.getElementById('mdl');

    document.getElementById('app').style.filter = '';
    container.style.visibility = 'hidden';
    container.style.opacity = 0;

    setTimeout(() => {
      Modal.isOpen = false;
      cb();
    }, 200);
  }

}