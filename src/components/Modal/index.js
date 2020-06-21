import { h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect } from 'preact/hooks';

function Modal({ isClosable, isOpen, onClose, children }) {

  useEffect(() => {
    document.getElementById('app').style.filter = isOpen ? 'blur(18px)' : '';
    document.body.classList.toggle('no-bg-image', isOpen);
  }, [ isOpen ]);
  
  const ModalRender = (
    <div class="modal-wrapper">

      { isClosable && (
          <button
            class="thin icon icon-cancel"
            aria-label="Close Modal"
            onClick={onClose}
            onKeyDown={e => { e.which === 13 && onClose(e) }}
          />
        )
      }

      <div class="modal">
        { children }
      </div>
    </div>
  );

  if (isOpen) {
    return createPortal(ModalRender, document.body);
  }

  return null;
}

Modal.defaultProps = {
  isClosable: true,
};

export default Modal;