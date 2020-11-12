import { h, render } from 'preact';
import { nanoid } from 'nanoid';
import ToastContainer from './ToastContainer';

let container;
let queue = [];

const setQueue = (newQueue) => {
  if (typeof window === 'undefined') return;

  queue = newQueue;

  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  render(<ToastContainer queue={queue} />, container);
};

setQueue([]);

const toast = (message) => {
  const item = { message, id: nanoid(8) };
  if (queue.length < 4) {
    setQueue([ ...queue, item ]);

    setTimeout(() => {
      setQueue(queue.slice(1));
    }, 4000);
  } else {
    setQueue([ ...queue.slice(1), item ])
  }
};

export { toast };