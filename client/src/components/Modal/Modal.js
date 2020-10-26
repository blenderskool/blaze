import { h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { XCircle } from 'preact-feather';

import './Modal.scss';

function Modal({ isClosable, isOpen, onClose, children }) {

  useEffect(() => {
    document.body.classList.toggle('no-bg-image', isOpen);
  }, [ isOpen ]);

  useEffect(() => {

    const handleEsc = (event) => {
        if (event.key === "Escape"||event.keyCode === 27 || event.which===27) {
          onClose();
        }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return createPortal(
    <div class="modal-wrapper" style={isOpen ? { opacity: 1, visibility: 'visible' } : {}}>

      { isClosable && (
          <button
            class="thin icon close"
            aria-label="Close Modal"
            onClick={onClose}
            onKeyDown={e => { e.which === 13 && onClose(e) }}
          >
            <XCircle />
          </button>
        )
      }

      <div class="modal">
        { children }
      </div>
    </div>,
    document.body
  );
}

Modal.defaultProps = {
  isClosable: true,
};

export default Modal;