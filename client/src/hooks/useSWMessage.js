import { useState, useEffect } from 'preact/hooks';

/**
 * Subscribes to a message sent from service worker
 * @param {*} initial Initial state of the message
 * @param {String} action Action to listen from service worker
 * @returns Message associated with the listened action
 */
function useSWMessage(initial, action) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.serviceWorker) return;

    const handleMessage = (event) => {
      if (event.data.action === action) {
        setData(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [action]);

  return [data, setData];
}

export default useSWMessage;
