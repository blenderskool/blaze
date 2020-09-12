import { h, render } from 'preact';

import Toast from './Toast';
import './ToastContainer.scss';

let container;
let queue = [];

function ToastContainer() {
  return (
    <div class="toast-container">
      {queue.map(message => <Toast>{message}</Toast>)}
    </div>
  );
}

const setQueue = (newQueue) => {
  queue = newQueue;

  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  render(<ToastContainer />, container);
};

const toast = (message) => {
  setQueue([ ...queue, message ]);

  setTimeout(() => {
    setQueue(queue.slice(0, -1));
  }, 4000);
}

export { toast };