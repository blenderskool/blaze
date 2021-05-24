import { useState } from 'preact/hooks';
import urls from '../utils/urls';

/**
 * Hook to fetch instant room from the server
 * @param {Function} cb Callback function called with instant room name passed as parameter
 */
function useInstantRoom(cb) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return [
    async () => {
      setLoading(true);
      try {
        const res = await fetch(`${urls.SERVER_HOST}/instant-room`);
        const { room } = await res.json();
        cb(room);
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    { loading, error },
  ];
}

export default useInstantRoom;
