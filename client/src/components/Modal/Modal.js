import { h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { XCircle } from 'preact-feather';
import PropTypes from 'prop-types';

import './Modal.scoped.scss';

/**
 * This hook can be used to toggle visibility of elements when the container has
 * animated visibility. The issue occurrs during the "close" phase of the animation
 * where the elements are meant to stay mounted just till the animation finishes.
 * 
 * @param {boolean} initial Initial state
 * @param {number} time Time in milliseconds of the close animation
 * @returns {boolean} State variable that stays toggled ON till the animation completes
 */
function useAnimatedVisibility(initial, time) {
  const [showContents, setShowContents] = useState(initial);

  useEffect(() => {
    if (initial) {
      setShowContents(true);
    } else {
      const id = setTimeout(() => setShowContents(false), time);
      return () => clearTimeout(id);
    }
  }, [initial, setShowContents, time]);

  return showContents;
}

function Modal({ isClosable, isOpen, onClose, children }) {
  const showContents = useAnimatedVisibility(isOpen, 200);

  useEffect(() => {
    document.body.classList.toggle('no-bg-image', isOpen);
  }, [ isOpen ]);

  useEffect(() => {
    if (isClosable){
      const handleEsc = (event) => {
        if (event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
          onClose(event);
        }
      };

      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [ isClosable, onClose ]);

  return createPortal(
    <div class="modal-wrapper" style={isOpen ? { opacity: 1, visibility: 'visible' } : {}}>

      { isClosable && (
          <button
            class="btn thin icon close"
            aria-label="Close Modal"
            onClick={onClose}
            onKeyDown={e => { e.which === 13 && onClose(e) }}
          >
            <XCircle />
          </button>
        )
      }

      <div class="modal">
        { showContents && children }
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  isClosable: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  isClosable: true,
  onClose: () => {},
};

export default Modal;