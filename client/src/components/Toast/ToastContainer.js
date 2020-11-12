import { h } from 'preact';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Toast from './Toast';
import './ToastContainer.scss';

function ToastContainer({ queue }) {
  return (
    <div class="toast-container">
      <TransitionGroup appear>
        {
          queue.map(({ message, id }) => (
            <CSSTransition
              classNames="fade"
              key={id}
              timeout={200}
              unmountOnExit
              onEnter={node => {
                node.style.marginBottom = `-${node.offsetHeight}px`;
                node.style.marginTop = `0px`;
              }}
              onEntering={node => {
                node.style.marginTop = '';
                node.style.marginBottom = '';
              }}
            >
              <Toast>{message}</Toast>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    </div>
  );
}

export default ToastContainer;
